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
    id: "prod-1",
    title: "Basmati Rice 5kg",
    text: "Premium long-grain basmati rice (5kg). Ideal for daily cooking and biryani. Price ₹549, often discounted. Category: Staples.",
    url: "https://www.pinelabs.com/products/basmati-rice-5kg",
    metadata: {
      brand: "Everyday Harvest",
      category: "Grocery > Staples",
      sku: "RICE-BAS-5KG",
      unitSize: "5 kg",
      priceInINR: 549,
      mrpInINR: 599,
      discountPercent: 8,
      inStock: true,
      tags: ["grocery", "staples", "rice", "basmati", "5kg"]
    }
  },
  {
    id: "prod-2",
    title: "Whole Wheat Atta 10kg",
    text: "Stone-ground whole wheat atta (10kg) for soft rotis. Price ₹449. Rich in fiber. Category: Staples.",
    url: "https://www.pinelabs.com/products/atta-10kg",
    metadata: {
      brand: "GrainMill",
      category: "Grocery > Staples",
      sku: "ATTA-WW-10KG",
      unitSize: "10 kg",
      priceInINR: 449,
      mrpInINR: 499,
      discountPercent: 10,
      inStock: true,
      tags: ["grocery", "staples", "atta", "wheat", "10kg", "flour"]
    }
  },
  {
    id: "prod-3",
    title: "Toor Dal 1kg",
    text: "Unpolished toor/arhar dal (1kg). Protein-rich lentils. Price ₹169. Category: Pulses.",
    url: "https://www.pinelabs.com/products/toor-dal-1kg",
    metadata: {
      brand: "PulsePro",
      category: "Grocery > Pulses",
      sku: "DAL-TOOR-1KG",
      unitSize: "1 kg",
      priceInINR: 169,
      mrpInINR: 189,
      discountPercent: 11,
      inStock: true,
      tags: ["grocery", "pulses", "dal", "toor", "arhar", "1kg"]
    }
  },
  {
    id: "prod-4",
    title: "Refined Sunflower Oil 1L",
    text: "Light refined sunflower oil (1L) for everyday cooking. Price ₹139. Category: Oils.",
    url: "https://www.pinelabs.com/products/sunflower-oil-1l",
    metadata: {
      brand: "SunLite",
      category: "Grocery > Oils",
      sku: "OIL-SUN-1L",
      unitSize: "1 L",
      priceInINR: 139,
      mrpInINR: 155,
      discountPercent: 10,
      inStock: true,
      tags: ["grocery", "oil", "sunflower", "1l", "cooking"]
    }
  },
  {
    id: "prod-5",
    title: "Granulated Sugar 1kg",
    text: "Fine granulated sugar (1kg). Price ₹48. Category: Staples.",
    url: "https://www.pinelabs.com/products/sugar-1kg",
    metadata: {
      brand: "SweetLeaf",
      category: "Grocery > Staples",
      sku: "SUG-REG-1KG",
      unitSize: "1 kg",
      priceInINR: 48,
      mrpInINR: 55,
      discountPercent: 13,
      inStock: true,
      tags: ["grocery", "sugar", "staples", "1kg"]
    }
  },
  {
    id: "prod-6",
    title: "Iodized Salt 1kg",
    text: "Iodized table salt (1kg). Price ₹22. Category: Staples.",
    url: "https://www.pinelabs.com/products/salt-1kg",
    metadata: {
      brand: "PureSalt",
      category: "Grocery > Staples",
      sku: "SALT-IOD-1KG",
      unitSize: "1 kg",
      priceInINR: 22,
      mrpInINR: 25,
      discountPercent: 12,
      inStock: true,
      tags: ["grocery", "salt", "staples", "1kg", "iodized"]
    }
  },
  {
    id: "prod-7",
    title: "Toned Milk 1L (UHT)",
    text: "Long-life UHT toned milk (1L). No refrigeration required before opening. Price ₹62. Category: Dairy.",
    url: "https://www.pinelabs.com/products/toned-milk-1l",
    metadata: {
      brand: "MilkyWay",
      category: "Grocery > Dairy",
      sku: "MILK-UHT-1L",
      unitSize: "1 L",
      priceInINR: 62,
      mrpInINR: 64,
      discountPercent: 3,
      inStock: true,
      tags: ["grocery", "dairy", "milk", "uht", "1l"]
    }
  },
  {
    id: "prod-8",
    title: "Plain Curd 400g",
    text: "Fresh plain dahi/curd (400g) with active cultures. Price ₹38. Category: Dairy.",
    url: "https://www.pinelabs.com/products/curd-400g",
    metadata: {
      brand: "MilkyWay",
      category: "Grocery > Dairy",
      sku: "CURD-PLN-400G",
      unitSize: "400 g",
      priceInINR: 38,
      mrpInINR: 40,
      discountPercent: 5,
      inStock: true,
      tags: ["grocery", "dairy", "curd", "dahi", "400g"]
    }
  },
  {
    id: "prod-9",
    title: "Salted Butter 500g",
    text: "Creamy salted butter (500g). Ideal for cooking and baking. Price ₹285. Category: Dairy.",
    url: "https://www.pinelabs.com/products/butter-500g",
    metadata: {
      brand: "CreamCraft",
      category: "Grocery > Dairy",
      sku: "BUT-SALT-500G",
      unitSize: "500 g",
      priceInINR: 285,
      mrpInINR: 299,
      discountPercent: 5,
      inStock: true,
      tags: ["grocery", "dairy", "butter", "500g", "salted"]
    }
  },
  {
    id: "prod-10",
    title: "CTC Tea 500g",
    text: "Strong Assam CTC tea (500g) for a robust cup. Price ₹189. Category: Beverages.",
    url: "https://www.pinelabs.com/products/ctc-tea-500g",
    metadata: {
      brand: "Leaf&Co",
      category: "Grocery > Beverages",
      sku: "TEA-CTC-500G",
      unitSize: "500 g",
      priceInINR: 189,
      mrpInINR: 210,
      discountPercent: 10,
      inStock: true,
      tags: ["grocery", "tea", "ctc", "assam", "beverage", "500g"]
    }
  },
  {
    id: "prod-11",
    title: "Instant Coffee 200g",
    text: "100% coffee, freeze-dried granules (200g). Price ₹299. Category: Beverages.",
    url: "https://www.pinelabs.com/products/coffee-200g",
    metadata: {
      brand: "BrewFast",
      category: "Grocery > Beverages",
      sku: "COF-INS-200G",
      unitSize: "200 g",
      priceInINR: 299,
      mrpInINR: 349,
      discountPercent: 14,
      inStock: true,
      tags: ["grocery", "coffee", "beverage", "instant", "200g"]
    }
  },
  {
    id: "prod-12",
    title: "Masala Biscuits Family Pack",
    text: "Crispy masala-flavored biscuits, family pack (600g). Price ₹95. Category: Snacks.",
    url: "https://www.pinelabs.com/products/masala-biscuits-family",
    metadata: {
      brand: "SnackMate",
      category: "Grocery > Snacks",
      sku: "BISC-MASA-600G",
      unitSize: "600 g",
      priceInINR: 95,
      mrpInINR: 110,
      discountPercent: 14,
      inStock: true,
      tags: ["grocery", "snacks", "biscuits", "family pack", "masala"]
    }
  },
  {
    id: "prod-13",
    title: "Rolled Oats 1kg",
    text: "High-fiber rolled oats (1kg) for healthy breakfasts. Price ₹159. Category: Breakfast & Cereals.",
    url: "https://www.pinelabs.com/products/oats-1kg",
    metadata: {
      brand: "FitStart",
      category: "Grocery > Breakfast",
      sku: "OATS-ROL-1KG",
      unitSize: "1 kg",
      priceInINR: 159,
      mrpInINR: 199,
      discountPercent: 20,
      inStock: true,
      tags: ["grocery", "oats", "breakfast", "cereal", "1kg", "healthy"]
    }
  },
  {
    id: "prod-14",
    title: "Turmeric Powder 200g",
    text: "Pure haldi powder (200g). Deep color and aroma. Price ₹69. Category: Spices.",
    url: "https://www.pinelabs.com/products/turmeric-200g",
    metadata: {
      brand: "SpiceWorks",
      category: "Grocery > Spices",
      sku: "SPC-TURM-200G",
      unitSize: "200 g",
      priceInINR: 69,
      mrpInINR: 79,
      discountPercent: 13,
      inStock: true,
      tags: ["grocery", "spices", "turmeric", "haldi", "200g"]
    }
  },
  {
    id: "prod-15",
    title: "Red Chili Powder 200g",
    text: "Hot and vibrant red chili powder (200g). Price ₹89. Category: Spices.",
    url: "https://www.pinelabs.com/products/red-chili-200g",
    metadata: {
      brand: "SpiceWorks",
      category: "Grocery > Spices",
      sku: "SPC-CHIL-200G",
      unitSize: "200 g",
      priceInINR: 89,
      mrpInINR: 99,
      discountPercent: 10,
      inStock: true,
      tags: ["grocery", "spices", "chili", "lal mirch", "200g"]
    }
  },
  {
    id: "prod-16",
    title: "Cumin Seeds 100g",
    text: "Whole cumin/jeera seeds (100g). Strong aroma. Price ₹49. Category: Spices.",
    url: "https://www.pinelabs.com/products/cumin-100g",
    metadata: {
      brand: "SpiceWorks",
      category: "Grocery > Spices",
      sku: "SPC-CUMIN-100G",
      unitSize: "100 g",
      priceInINR: 49,
      mrpInINR: 55,
      discountPercent: 11,
      inStock: true,
      tags: ["grocery", "spices", "cumin", "jeera", "100g"]
    }
  },
  {
    id: "prod-17",
    title: "Onion 1kg (Fresh)",
    text: "Fresh onions (1kg). Daily vegetables. Price ₹34. Category: Produce.",
    url: "https://www.pinelabs.com/products/onion-1kg",
    metadata: {
      brand: "FarmFresh",
      category: "Grocery > Produce",
      sku: "VEG-ONION-1KG",
      unitSize: "1 kg",
      priceInINR: 34,
      mrpInINR: 39,
      discountPercent: 13,
      inStock: true,
      tags: ["grocery", "vegetables", "produce", "onion", "pyaaz", "1kg"]
    }
  },
  {
    id: "prod-18",
    title: "Tomato 1kg (Fresh)",
    text: "Ripe red tomatoes (1kg). Price ₹42. Category: Produce.",
    url: "https://www.pinelabs.com/products/tomato-1kg",
    metadata: {
      brand: "FarmFresh",
      category: "Grocery > Produce",
      sku: "VEG-TOM-1KG",
      unitSize: "1 kg",
      priceInINR: 42,
      mrpInINR: 48,
      discountPercent: 12,
      inStock: true,
      tags: ["grocery", "vegetables", "produce", "tomato", "tamatar", "1kg"]
    }
  },
  {
    id: "prod-19",
    title: "Potato 5kg (Fresh)",
    text: "Clean potatoes (5kg). Daily staple. Price ₹135. Category: Produce.",
    url: "https://www.pinelabs.com/products/potato-5kg",
    metadata: {
      brand: "FarmFresh",
      category: "Grocery > Produce",
      sku: "VEG-POT-5KG",
      unitSize: "5 kg",
      priceInINR: 135,
      mrpInINR: 159,
      discountPercent: 15,
      inStock: true,
      tags: ["grocery", "vegetables", "produce", "potato", "aloo", "5kg"]
    }
  },
  {
    id: "prod-20",
    title: "Dishwash Liquid 500ml (Lemon)",
    text: "Grease-cutting dishwash liquid (500ml), lemon fragrance. Price ₹69. Category: Household.",
    url: "https://www.pinelabs.com/products/dishwash-500ml",
    metadata: {
      brand: "CleanDrop",
      category: "Household",
      sku: "HOME-DWASH-500ML",
      unitSize: "500 ml",
      priceInINR: 69,
      mrpInINR: 79,
      discountPercent: 13,
      inStock: true,
      tags: ["household", "cleaning", "dishwash", "lemon", "500ml"]
    }
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
