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

// sample data
const products = [
  { id: "atta001", name: "Aashirvaad Atta", price: 260 },
  { id: "atta002", name: "Fortune Atta", price: 250 },
];

// ✅ 1. create MCP server
const server = new Server(
  { name: "agentic-pay-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// ✅ 2. register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
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
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "searchProducts") {
    const q = request.params.arguments.query.toLowerCase();
    const results = products.filter((p) =>
      p.name.toLowerCase().includes(q)
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ results }, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// ✅ 3. SSE endpoint (persistent stream)
// Let SSEServerTransport handle ALL header writing
app.get("/sse", async (req, res) => {
  console.log("SSE connection initiated");

  try {
    const transport = new SSEServerTransport("/message", res);
    await server.connect(transport);
    console.log("✅ SSE transport connected");

    // ✅ Send initial valid SSE event immediately
    res.write(`data: ${JSON.stringify({ status: "connected", ok: true })}\n\n`);

    // 🔁 Keepalive ping every 15s to prevent Render closing connection
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
    if (!res.headersSent) {
      res.status(500).end();
    }
  }
});



// ✅ 4. message endpoint (handle JSON-RPC directly)
app.post("/message", async (req, res) => {
  try {
    const { method, params, id } = req.body;

    console.log("🔹 Incoming message:", JSON.stringify(req.body, null, 2));

    let result;

    switch (method) {
      // Handle "tools/list" — ChatGPT connector requests this on connect
      case "tools/list":
        result = await server.requestHandler(ListToolsRequestSchema, {
          method,
          params: {},
        });
        break;

      // Handle "tools/call" — when ChatGPT actually invokes your tool
      case "tools/call":
        result = await server.requestHandler(CallToolRequestSchema, {
          method,
          params,
        });
        break;

      default:
        // Unknown RPC method
        return res.status(400).json({
          jsonrpc: "2.0",
          id,
          error: {
            code: -32601,
            message: `Unknown method: ${method}`,
          },
        });
    }

    // ✅ Respond with standard JSON-RPC success
    return res.json({
      jsonrpc: "2.0",
      id,
      result,
    });
  } catch (err) {
    console.error("❌ Error in /message:", err);

    // Proper JSON-RPC error response
    return res.status(500).json({
      jsonrpc: "2.0",
      id: req.body?.id,
      error: {
        code: -32603,
        message: err.message || "Internal Server Error",
      },
    });
  }
});


// ✅ 5. health check
app.get("/", (req, res) => res.send("MCP Server running ✅"));

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`MCP server running on http://localhost:${PORT}`);
  console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
  console.log(`Message endpoint: http://localhost:${PORT}/message`);
});
