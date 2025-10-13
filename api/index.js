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
    const q = String(request.params.arguments?.query || "").toLowerCase();
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
// Note: SSE may not work properly on Vercel due to serverless limitations
app.get("/sse", async (req, res) => {
  console.log("SSE connection initiated");
  
  try {
    const transport = new SSEServerTransport("/message", res);
    await server.connect(transport);
    
    console.log("SSE transport connected");
    
    req.on('close', () => {
      console.log('SSE connection closed');
    });
  } catch (error) {
    console.error("Error setting up SSE:", error);
    if (!res.headersSent) {
      res.status(500).end();
    }
  }
});

// ✅ 4. message endpoint (handle JSON-RPC directly)
app.post("/message", async (req, res) => {
  try {
    console.log("Received message:", JSON.stringify(req.body, null, 2));
    const { method, params, id } = req.body;
    
    let result;
    
    if (method === "list_tools" || method === "tools/list") {
      // Directly return the tools list
      result = {
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
    } else if (method === "call_tool" || method === "tools/call") {
      // Handle tool calls
      if (params?.name === "searchProducts") {
        const q = String(params.arguments?.query || "").toLowerCase();
        const results = products.filter((p) =>
          p.name.toLowerCase().includes(q)
        );
        result = {
          content: [
            {
              type: "text",
              text: JSON.stringify({ results }, null, 2),
            },
          ],
        };
      } else {
        return res.json({
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Unknown tool: ${params?.name}` }
        });
      }
    } else {
      return res.json({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `Unknown method: ${method}` }
      });
    }
    
    res.json({ jsonrpc: "2.0", id, result });
  } catch (err) {
    console.error("Error in /message:", err);
    res.status(500).json({ 
      jsonrpc: "2.0", 
      id: req.body?.id, 
      error: { code: -32603, message: err.message } 
    });
  }
});

// ✅ 5. health check
app.get("/", (req, res) => res.json({ 
  status: "MCP Server running ✅",
  endpoints: {
    health: "/",
    message: "/message",
    sse: "/sse (may have limitations on Vercel)"
  }
}));

// ✅ 6. Export for Vercel (IMPORTANT!)
export default app;

// Local development server (ignored by Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`MCP server running on http://localhost:${PORT}`);
    console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
    console.log(`Message endpoint: http://localhost:${PORT}/message`);
  });
}
