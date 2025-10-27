// index.js
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

/** -------- Middleware -------- */
app.use(express.json({ limit: '1mb' }));
app.use(cors({
  origin: (_origin, cb) => cb(null, true), // loosen for dev; restrict in prod
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Mcp-Session-Id',
    'MCP-Protocol-Version'
  ]
}));

/** -------- Dummy data -------- */
const dummyDocuments = [
  {
    id: "doc-1",
    title: "Complete Guide to Node.js Development",
    text: "Node.js is a powerful JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to build scalable network applications using JavaScript on the server side. Key features include event-driven architecture, non-blocking I/O operations, and a rich ecosystem through npm. Popular frameworks include Express.js for web applications, Socket.io for real-time communication, and many others. Node.js is widely used for building APIs, microservices, and full-stack applications.",
    url: "https://example.com/nodejs-guide",
    metadata: { author: "Tech Expert", category: "Programming", tags: ["javascript", "backend", "server"] }
  },
  {
    id: "doc-2",
    title: "Understanding RESTful APIs",
    text: "REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use standard HTTP methods like GET, POST, PUT, DELETE to perform operations on resources. Key principles include statelessness, uniform interface, cacheable responses, and layered system architecture. Best practices include proper status codes, consistent naming conventions, versioning, and comprehensive documentation. RESTful APIs are essential for modern web development and microservices architecture.",
    url: "https://example.com/rest-api-guide",
    metadata: { author: "API Designer", category: "Web Development", tags: ["api", "rest", "http"] }
  },
  {
    id: "doc-3",
    title: "Database Design Fundamentals",
    text: "Database design is crucial for application performance and scalability. Key concepts include normalization to reduce redundancy, proper indexing for query optimization, and choosing appropriate data types. Relational databases like PostgreSQL and MySQL follow ACID properties, while NoSQL databases like MongoDB offer flexibility for unstructured data. Consider factors like consistency requirements, scalability needs, and query patterns when choosing a database solution.",
    url: "https://example.com/database-design",
    metadata: { author: "Database Expert", category: "Database", tags: ["sql", "nosql", "design"] }
  },
  {
    id: "doc-4",
    title: "Modern JavaScript ES6+ Features",
    text: "ES6 introduced many powerful features to JavaScript including arrow functions, template literals, destructuring assignment, and promises. ES2017 added async/await for better asynchronous programming. Other important features include modules for better code organization, classes for object-oriented programming, and new data structures like Map and Set. These features make JavaScript more powerful and developer-friendly for modern application development.",
    url: "https://example.com/javascript-es6",
    metadata: { author: "JS Developer", category: "Programming", tags: ["javascript", "es6", "modern"] }
  },
  {
    id: "doc-5",
    title: "Cloud Computing Basics",
    text: "Cloud computing provides on-demand access to computing resources over the internet. Main service models include IaaS, PaaS, and SaaS. Major providers like AWS, Azure, and Google Cloud offer services including VMs, databases, storage, and serverless computing. Benefits include scalability, cost-effectiveness, and reduced infrastructure management overhead.",
    url: "https://example.com/cloud-computing",
    metadata: { author: "Cloud Architect", category: "Cloud Technology", tags: ["cloud", "aws", "azure"] }
  }
];

/** -------- Small helpers -------- */
const jsonrpcOk   = (id, result) => ({ jsonrpc: '2.0', id, result });
const jsonrpcErr  = (id, code, message, data) => ({ jsonrpc: '2.0', id, error: { code, message, data } });
const newSessionId = () => crypto.randomUUID();

/** In-memory sessions (optional but handy) */
const sessions = new Map();

/** -------- Health & info -------- */
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

/** -------- Shared MCP logic -------- */
function toolsDefinition() {
  return {
    tools: [
      {
        name: "search",
        title: "Search documents",
        description: "Search through documents using a query string",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query text" }
          },
          required: ["query"],
          additionalProperties: false
        }
      },
      {
        name: "fetch",
        title: "Fetch a document",
        description: "Fetch full content of a document by ID",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Document ID (e.g., doc-1)" }
          },
          required: ["id"],
          additionalProperties: false
        },
        // optional: structured output
        outputSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            text: { type: "string" },
            url: { type: "string" },
            metadata: { type: "object" }
          },
          required: ["id","title","text"],
          additionalProperties: true
        }
      }
    ]
  };
}

function handleToolsCall(params) {
  const { name, arguments: args } = params || {};
  if (name === 'search') {
    const q = (args?.query || '').toLowerCase();
    const results = dummyDocuments
      .filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.text.toLowerCase().includes(q) ||
        d.metadata.tags.some(t => t.toLowerCase().includes(q))
      )
      .map(d => ({ id: d.id, title: d.title, url: d.url }));

    return { content: [{ type: 'text', text: JSON.stringify({ results }) }] };
  }

  if (name === 'fetch') {
    const id = args?.id;
    const doc = dummyDocuments.find(d => d.id === id);
    if (!doc) {
      throw { code: -32004, message: `Document with id ${id} not found` };
    }
    return { content: [{ type: 'text', text: JSON.stringify(doc) }] };
  }

  throw { code: -32601, message: `Unknown tool: ${name}` };
}

/** -------- Streamable HTTP (modern) at /mcp --------
 * POST /mcp -> JSON-RPC 2.0 single-response JSON (no streaming needed)
 * GET  /mcp -> optional SSE for server->client notifications
 */
app.post('/mcp', (req, res) => {
  // Advertise/echo protocol version header (optional but nice)
  res.setHeader('MCP-Protocol-Version', '2025-06-18');

  const { jsonrpc, id, method, params } = req.body || {};
  if (jsonrpc !== '2.0') {
    return res.status(400).json(jsonrpcErr(null, -32600, 'Invalid Request'));
  }

  try {
    if (method === 'initialize') {
      // negotiate protocolVersion if client supplied one
      const requestedVersion = params?.protocolVersion || '2025-06-18';
      const supported = new Set(['2025-06-18', '2025-03-26', '2024-11-05']);
      const protocolVersion = supported.has(requestedVersion) ? requestedVersion : '2025-06-18';

      const sid = newSessionId();
      sessions.set(sid, { createdAt: Date.now() });
      res.setHeader('Mcp-Session-Id', sid);

      return res.json(jsonrpcOk(id, {
        protocolVersion,
        capabilities: {
          // Required shape: tools.listChanged boolean
          tools: { listChanged: false }
        },
        serverInfo: {
          name: 'AgenticPay MCP',
          title: 'AgenticPay Demo Server',
          version: '1.0.0'
        },
        instructions: 'Use tools/list then tools/call(search|fetch).'
      }));
    }

    if (method === 'tools/list') {
      return res.json(jsonrpcOk(id, toolsDefinition()));
    }

    if (method === 'tools/call') {
      const result = handleToolsCall(params);
      return res.json(jsonrpcOk(id, result));
    }

    if (method === 'ping') {
      return res.json(jsonrpcOk(id, { now: new Date().toISOString() }));
    }

    return res.json(jsonrpcErr(id, -32601, `Unknown method: ${method}`));
  } catch (e) {
    const { code = -32000, message = 'Internal server error', data } = e || {};
    return res.json(jsonrpcErr(id, code, message, data));
  }
});

// Optional: GET /mcp SSE stream for unsolicited notifications
app.get('/mcp', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': '*'
  });
  res.flushHeaders?.();

  // Example: notify capabilities on connect (JSON-RPC as "message" event)
  const note = {
    jsonrpc: '2.0',
    method: 'notifications/capabilities',
    params: toolsDefinition()
  };
  res.write(`event: message\n`);
  res.write(`data: ${JSON.stringify(note)}\n\n`);

  const keepalive = setInterval(() => res.write(`: ping ${Date.now()}\n\n`), 15000);
  req.on('close', () => clearInterval(keepalive));
});

/** -------- Legacy HTTP+SSE shim at /sse --------
 * GET /sse  -> first send: event:endpoint with POST URL
 * POST /sse -> accept JSON-RPC and return JSON (not SSE)
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

  const postUrl = `${req.protocol}://${req.get('host')}/sse`;

  // REQUIRED by legacy: tell client where to POST JSON-RPC
  res.write(`event: endpoint\n`);
  res.write(`data: ${JSON.stringify({ url: postUrl })}\n\n`);

  // Optional immediate capabilities notification (JSON-RPC in "message")
  const capabilitiesMsg = {
    jsonrpc: '2.0',
    method: 'notifications/capabilities',
    params: toolsDefinition()
  };
  res.write(`event: message\n`);
  res.write(`data: ${JSON.stringify(capabilitiesMsg)}\n\n`);

  const keepalive = setInterval(() => res.write(`: ping ${Date.now()}\n\n`), 15000);
  req.on('close', () => clearInterval(keepalive));
});

app.post('/sse', (req, res) => {
  const { jsonrpc, id, method, params } = req.body || {};
  if (jsonrpc !== '2.0') {
    return res.status(400).json(jsonrpcErr(null, -32600, 'Invalid Request'));
  }
  try {
    if (method === 'initialize') {
      return res.json(jsonrpcOk(id, {
        protocolVersion: '2024-11-05',
        capabilities: { tools: { listChanged: false } },
        serverInfo: {
          name: 'AgenticPay MCP',
          title: 'AgenticPay Demo Server (Legacy)',
          version: '1.0.0'
        },
        instructions: 'Use tools/list then tools/call(search|fetch).'
      }));
    }
    if (method === 'tools/list') {
      return res.json(jsonrpcOk(id, toolsDefinition()));
    }
    if (method === 'tools/call') {
      const result = handleToolsCall(params);
      return res.json(jsonrpcOk(id, result));
    }
    return res.json(jsonrpcErr(id, -32601, `Unknown method: ${method}`));
  } catch (e) {
    const { code = -32000, message = 'Internal server error', data } = e || {};
    return res.json(jsonrpcErr(id, code, message, data));
  }
});

/** -------- Preflight -------- */
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Mcp-Session-Id, MCP-Protocol-Version');
  res.sendStatus(200);
});

/** -------- Start server -------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`Health:        http://localhost:${PORT}/health`);
  console.log(`Modern MCP:    http://localhost:${PORT}/mcp (POST/GET)`);
  console.log(`Legacy SSE:    http://localhost:${PORT}/sse (GET + POST)`);
});

module.exports = app;
