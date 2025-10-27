// server.mjs
import express from "express";
import cors from "cors";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const app = express();
app.use(cors());
app.use(express.json());

// ---- sample data ------------------------------------------------------------
const products = [
  { id: "atta001", name: "Aashirvaad Atta", price: 260 },
  { id: "atta002", name: "Fortune Atta", price: 250 },
];

// ---- MCP server for SSE transport ------------------------------------------
const mcpServer = new Server(
  { name: "agentic-pay-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// These handlers are used when ChatGPT talks over the **SSE** transport:
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "searchProducts",
      description: "Search for products by name",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query for product name" },
        },
        required: ["query"],
      },
    },
  ],
}));

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "searchProducts") {
    const q = String(request.params.arguments?.query ?? "").toLowerCase();
    const results = products.filter((p) =>
      p.name.toLowerCase().includes(q)
    );
    return {
      content: [{ type: "text", text: JSON.stringify({ results }, null, 2) }],
    };
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});

// ---- SSE endpoint (legacy HTTP+SSE) ----------------------------------------
async function sseHandler(req, res) {
  console.log("SSE connection initiated");

  const proto =
    req.headers["x-forwarded-proto"]?.toString() || req.protocol || "https";
  const host = req.headers["x-forwarded-host"]?.toString() || req.headers.host;
  const origin = `${proto}://${host}`;
  const messageEndpoint = `${origin}/message`;

  try {
    const transport = new SSEServerTransport(messageEndpoint, res);
    await mcpServer.connect(transport);
    console.log("✅ SSE transport connected");

    const keepAlive = setInterval(() => {
      try {
        res.write(`: ping\n\n`);
      } catch (err) {
        console.warn("SSE ping failed:", err);
        clearInterval(keepAlive);
      }
    }, 15000);

    req.on("close", () => {
      clearInterval(keepAlive);
      console.log("SSE connection closed");
    });
  } catch (error) {
    console.error("❌ Error setting up SSE:", error);
    if (!res.headersSent) res.status(500).end();
  }
}

app.get("/sse", sseHandler);
app.get("/sse/", sseHandler);

// ---- JSON-RPC endpoint (manual handling) -----------------------------------
app.post("/message", async (req, res) => {
  try {
    const { method, params, id } = req.body || {};
    console.log("🔹 Incoming /message:", JSON.stringify(req.body, null, 2));

    // Notifications (no response)
    if (!id && typeof method === "string" && method.startsWith("notifications/")) {
      return res.status(204).end();
    }

    // 1) initialize (REQUIRED)
    if (method === "initialize") {
      const result = {
        protocolVersion: "2025-05-31",
        capabilities: { tools: {} },
        serverInfo: { name: "agentic-pay-server", version: "1.0.0" },
      };
      return res.json({ jsonrpc: "2.0", id, result });
    }

    // 2) optional list endpoints
    if (method === "resources/list") {
      return res.json({ jsonrpc: "2.0", id, result: { resources: [] } });
    }
    if (method === "prompts/list") {
      return res.json({ jsonrpc: "2.0", id, result: { prompts: [] } });
    }

    // 3) tools/list — build response directly (no mcpServer.requestHandler)
    if (method === "tools/list") {
      const result = {
        tools: [
          {
            name: "searchProducts",
            description: "Search for products by name",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query for product name",
                },
              },
              required: ["query"],
            },
          },
        ],
      };
      return res.json({ jsonrpc: "2.0", id, result });
    }

    // 4) tools/call — implement tool logic directly
    if (method === "tools/call") {
      const toolName = params?.name;
      if (toolName === "searchProducts") {
        const q = String(params?.arguments?.query ?? "").toLowerCase();
        const results = products.filter((p) =>
          p.name.toLowerCase().includes(q)
        );
        const result = {
          content: [{ type: "text", text: JSON.stringify({ results }, null, 2) }],
        };
        return res.json({ jsonrpc: "2.0", id, result });
      }
      return res.status(400).json({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `Unknown tool: ${toolName}` },
      });
    }

    // 5) Unknown method
    return res.status(400).json({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Unknown method: ${method}` },
    });
  } catch (err) {
    console.error("❌ Error in /message:", err);
    return res.status(500).json({
      jsonrpc: "2.0",
      id: req.body?.id,
      error: { code: -32603, message: err.message || "Internal Server Error" },
    });
  }
});

// ---- Health check -----------------------------------------------------------
app.get("/", (req, res) => res.send("MCP Server running ✅"));

// ---- Start -----------------------------------------------------------------
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`MCP server running on http://localhost:${PORT}`);
  console.log(`Health:   http://localhost:${PORT}/`);
  console.log(`SSE:      http://localhost:${PORT}/sse`);
  console.log(`Message:  http://localhost:${PORT}/message`);
});
