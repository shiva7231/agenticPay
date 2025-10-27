// index.js
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '1mb' }));

/**
 * CORS: keep permissive for dev; tighten in prod.
 * Streamable HTTP spec also recommends Origin validation. (You can restrict by env var.)
 * Ref: MCP Streamable HTTP security notes.
 */
app.use(cors({
  origin: (_origin, cb) => cb(null, true),
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Mcp-Session-Id', 'MCP-Protocol-Version']
}));

/** ---------- Dummy data ---------- */
const dummyDocuments = [
  {
    id: "doc-1",
    title: "Complete Guide to Node.js Development",
    text: "Node.js is a powerful JavaScript runtime built on Chrome's V8 JavaScript engine...",
    url: "https://example.com/nodejs-guide",
    metadata: { author: "Tech Expert", category: "Programming", tags: ["javascript", "backend", "server"] }
  },
  {
    id: "doc-2",
    title: "Understanding RESTful APIs",
    text: "REST (Representational State Transfer) is an architectural style...",
    url: "https://example.com/rest-api-guide",
    metadata: { author: "API Designer", category: "Web Development", tags: ["api", "rest", "http"] }
  },
  {
    id: "doc-3",
    title: "Database Design Fundamentals",
    text: "Database design is crucial for application performance and scalability...",
    url: "https://example.com/database-design",
    metadata: { author: "Database Expert", category: "Database", tags: ["sql", "nosql", "design"] }
  },
  {
    id: "doc-4",
    title: "Modern JavaScript ES6+ Features",
    text: "ES6 introduced many powerful features to JavaScript...",
    url: "https://example.com/javascript-es6",
    metadata: { author: "JS Developer", category: "Programming", tags: ["javascript", "es6", "modern"] }
  },
  {
    id: "doc-5",
    title: "Cloud Computing Basics",
    text: "Cloud computing provides on-demand access to computing resources...",
    url: "https://example.com/cloud-computing",
    metadata: { author: "Cloud Architect", category: "Cloud Technology", tags: ["cloud", "aws", "azure"] }
  }
];

/** ---------- Utilities ---------- */
const jsonrpcOk = (id, result) => ({ jsonrpc: '2.0', id, result });
const jsonrpcErr = (id, code, message, data) => ({ jsonrpc: '2.0', id, error: { code, message, data } });
const newSessionId = () => crypto.randomUUID();

/** Session storage (in-memory) */
const sessions = new Map();

/** ---------- Health & simple info ---------- */
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/capabilities', (req, res) => {
  res.json({
    capabilities: {
      tools: [
        { name: "search", description: "Search through documents using a query string" },
        { name: "fetch",  description: "Fetch full content of a document by ID" }
      ]
    }
  });
});

/** ---------- JSON-RPC handlers (shared) ---------- */
function listTools() {
  return {
    tools: [
      {
        name: "search",
        description: "Search through documents using a query string",
        inputSchema: {
          type: "object",
          properties: { query: { type: "string", description: "Search query" } },
          required: ["query"]
        }
      },
      {
        name: "fetch",
        description: "Fetch full content of a document by ID",
        inputSchema: {
          type: "object",
          properties: { id: { type: "string", description: "Document ID" } },
          required: ["id"]
        }
      }
    ]
  };
}

function handleToolsCall(params) {
  const { name, arguments: args } = params || {};
  if (name === 'search') {
    const q = (args?.query || '').toLowerCase();
    const results = dummyDocuments.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.text.toLowerCase().includes(q) ||
      d.metadata.tags.some(t => t.toLowerCase().includes(q))
    ).map(d => ({ id: d.id, title: d.title, url: d.url }));
    return { content: [{ type: 'text', text: JSON.stringify({ results }) }] };
  }
  if (name === 'fetch') {
    const id = args?.id;
    const doc = dummyDocuments.find(d => d.id === id);
    if (!doc) throw { code: -32004, message: `Document with id ${id} not found` };
    return { content: [{ type: 'text', text: JSON.stringify(doc) }] };
  }
  throw { code: -32601, message: `Unknown tool: ${name}` };
}

/** ---------- Streamable HTTP transport (modern) ----------
 * Single MCP endpoint that supports:
 *   - POST: JSON-RPC request/notification/response
 *   - GET: optional SSE stream for server->client notifications
 * Spec: modelcontextprotocol.io Streamable HTTP (2025-06-18)
 */
app.post('/mcp', (req, res) => {
  // Recommended: advertise protocol version negotiation
  res.setHeader('MCP-Protocol-Version', '2025-06-18');

  const { jsonrpc, id, method, params } = req.body || {};
  if (jsonrpc !== '2.0') {
    return res.status(400).json(jsonrpcErr(null, -32600, 'Invalid Request'));
  }

  try {
    // Initialize: create a session and return capabilities
    if (method === 'initialize') {
      const sid = newSessionId();
      sessions.set(sid, { createdAt: Date.now() });
      res.setHeader('Mcp-Session-Id', sid);
      return res.json(jsonrpcOk(id, {
        protocolVersion: '2025-06-18',
        capabilities: { tools: { list: true, call: true } }
      }));
    }

    // tools/list
    if (method === 'tools/list') {
      return res.json(jsonrpcOk(id, listTools()));
    }

    // tools/call
    if (method === 'tools/call') {
      const result = handleToolsCall(params);
      return res.json(jsonrpcOk(id, result));
    }

    // Optional ping
    if (method === 'ping') {
      return res.json(jsonrpcOk(id, { now: new Date().toISOString() }));
    }

    return res.json(jsonrpcErr(id, -32601, `Unknown method: ${method}`));
  } catch (e) {
    const { code = -32000, message = 'Internal server error', data } = e || {};
    return res.json(jsonrpcErr(id, code, message, data));
  }
});

// Optional: GET /mcp opens an SSE stream for unsolicited server->client notifications (not required).
app.get('/mcp', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': '*'
  });
  res.flushHeaders?.();

  // Example: send a capabilities notification
  const note = {
    jsonrpc: '2.0',
    method: 'notifications/capabilities',
    params: listTools()
  };
  res.write(`event: message\n`);
  res.write(`data: ${JSON.stringify(note)}\n\n`);

  const keepalive = setInterval(() => res.write(`: ping ${Date.now()}\n\n`), 15000);
  req.on('close', () => clearInterval(keepalive));
});

/** ---------- Legacy HTTP+SSE transport shim ----------
 * Some clients still attempt the deprecated transport.
 * Requirements:
 *   - GET /sse must first emit:  event: endpoint  data: {"url":"<POST url>"}
 *   - POST /sse accepts JSON-RPC and replies with JSON-RPC (usually application/json).
 * Spec: legacy HTTP+SSE & backwards-compat guidance.
 */
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'X-Accel-Buffering': 'no'
  });
  res.flushHeaders?.();

  // REQUIRED first event for legacy clients
  const postUrl = `${req.protocol}://${req.get('host')}/sse`;
  res.write(`event: endpoint\n`);
  res.write(`data: ${JSON.stringify({ url: postUrl })}\n\n`);

  // Optional: immediate capabilities as JSON-RPC notification on "message"
  const capabilitiesMsg = {
    jsonrpc: '2.0',
    method: 'notifications/capabilities',
    params: listTools()
  };
  res.write(`event: message\n`);
  res.write(`data: ${JSON.stringify(capabilitiesMsg)}\n\n`);

  const keepalive = setInterval(() => res.write(`: ping ${Date.now()}\n\n`), 15000);
  req.on('close', () => clearInterval(keepalive));
});

app.post('/sse', (req, res) => {
  const { jsonrpc, id, method, params } = req.body || {};
  if (jsonrpc !== '2.0') {
    return res.status(400).json({ jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid Request' } });
  }
  try {
    if (method === 'initialize') {
      return res.json({
        jsonrpc: '2.0',
        id,
        result: { protocolVersion: '2024-11-05', capabilities: { tools: { list: true, call: true } } }
      });
    }

    if (method === 'tools/list') {
      return res.json({ jsonrpc: '2.0', id, result: listTools() });
    }

    // ✅ fixed line below
    if (method === 'tools/call') {
      const result = handleToolsCall(params);
      return res.json({ jsonrpc: '2.0', id, result });
    }

    return res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: `Unknown method: ${method}` } });
  } catch (e) {
    const { code = -32000, message = 'Internal server error', data } = e || {};
    return res.json({ jsonrpc: '2.0', id, error: { code, message, data } });
  }
});


/** ---------- Preflight ---------- */
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Mcp-Session-Id, MCP-Protocol-Version');
  res.sendStatus(200);
});

/** ---------- Start ---------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Modern MCP endpoint: http://localhost:${PORT}/mcp (POST/GET)`);
  console.log(`Legacy SSE endpoint: http://localhost:${PORT}/sse (GET + POST)`);
});

module.exports = app;
