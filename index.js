// // index.js
// const express = require('express');
// const cors = require('cors');
// const crypto = require('crypto');

// const app = express();

// /** -------- Middleware -------- */
// app.use(express.json({ limit: '1mb' }));
// app.use(cors({
//   origin: (_origin, cb) => cb(null, true), // loosen for dev; restrict in prod
//   methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
//   allowedHeaders: [
//     'Content-Type',
//     'Authorization',
//     'Mcp-Session-Id',
//     'MCP-Protocol-Version'
//   ]
// }));

// /** --- Merchant static info (used in PBL + summaries) --- */
// const MERCHANT = {
//   name: 'Agentic Store',
//   supportEmail: 'support@pinelabs.com'
// };

// /** -------- Catalog (YOUR SAME LIST KEPT) -------- */
// const catalog = [
//   {
//     id: "prod-1",
//     title: "Basmati Rice 5kg",
//     text: "Premium long-grain basmati rice (5kg). Ideal for daily cooking and biryani. Price ₹549, often discounted. Category: Staples.",
//     url: "https://www.pinelabs.com/products/basmati-rice-5kg",
//     metadata: {
//       brand: "Everyday Harvest",
//       category: "Grocery > Staples",
//       sku: "RICE-BAS-5KG",
//       unitSize: "5 kg",
//       priceInINR: 549,
//       mrpInINR: 599,
//       discountPercent: 8,
//       inStock: true,
//       tags: ["grocery", "staples", "rice", "basmati", "5kg"]
//     }
//   },
//   {
//     id: "prod-2",
//     title: "Whole Wheat Atta 10kg",
//     text: "Stone-ground whole wheat atta (10kg) for soft rotis. Price ₹449. Rich in fiber. Category: Staples.",
//     url: "https://www.pinelabs.com/products/atta-10kg",
//     metadata: {
//       brand: "GrainMill",
//       category: "Grocery > Staples",
//       sku: "ATTA-WW-10KG",
//       unitSize: "10 kg",
//       priceInINR: 449,
//       mrpInINR: 499,
//       discountPercent: 10,
//       inStock: true,
//       tags: ["grocery", "staples", "atta", "wheat", "10kg", "flour"]
//     }
//   },
//   {
//     id: "prod-3",
//     title: "Toor Dal 1kg",
//     text: "Unpolished toor/arhar dal (1kg). Protein-rich lentils. Price ₹169. Category: Pulses.",
//     url: "https://www.pinelabs.com/products/toor-dal-1kg",
//     metadata: {
//       brand: "PulsePro",
//       category: "Grocery > Pulses",
//       sku: "DAL-TOOR-1KG",
//       unitSize: "1 kg",
//       priceInINR: 169,
//       mrpInINR: 189,
//       discountPercent: 11,
//       inStock: true,
//       tags: ["grocery", "pulses", "dal", "toor", "arhar", "1kg"]
//     }
//   },
//   {
//     id: "prod-4",
//     title: "Refined Sunflower Oil 1L",
//     text: "Light refined sunflower oil (1L) for everyday cooking. Price ₹139. Category: Oils.",
//     url: "https://www.pinelabs.com/products/sunflower-oil-1l",
//     metadata: {
//       brand: "SunLite",
//       category: "Grocery > Oils",
//       sku: "OIL-SUN-1L",
//       unitSize: "1 L",
//       priceInINR: 139,
//       mrpInINR: 155,
//       discountPercent: 10,
//       inStock: true,
//       tags: ["grocery", "oil", "sunflower", "1l", "cooking"]
//     }
//   },
//   {
//     id: "prod-5",
//     title: "Granulated Sugar 1kg",
//     text: "Fine granulated sugar (1kg). Price ₹48. Category: Staples.",
//     url: "https://www.pinelabs.com/products/sugar-1kg",
//     metadata: {
//       brand: "SweetLeaf",
//       category: "Grocery > Staples",
//       sku: "SUG-REG-1KG",
//       unitSize: "1 kg",
//       priceInINR: 48,
//       mrpInINR: 55,
//       discountPercent: 13,
//       inStock: true,
//       tags: ["grocery", "sugar", "staples", "1kg"]
//     }
//   },
//   {
//     id: "prod-6",
//     title: "Iodized Salt 1kg",
//     text: "Iodized table salt (1kg). Price ₹22. Category: Staples.",
//     url: "https://www.pinelabs.com/products/salt-1kg",
//     metadata: {
//       brand: "PureSalt",
//       category: "Grocery > Staples",
//       sku: "SALT-IOD-1KG",
//       unitSize: "1 kg",
//       priceInINR: 22,
//       mrpInINR: 25,
//       discountPercent: 12,
//       inStock: true,
//       tags: ["grocery", "salt", "staples", "1kg", "iodized"]
//     }
//   },
//   {
//     id: "prod-7",
//     title: "Toned Milk 1L (UHT)",
//     text: "Long-life UHT toned milk (1L). No refrigeration required before opening. Price ₹62. Category: Dairy.",
//     url: "https://www.pinelabs.com/products/toned-milk-1l",
//     metadata: {
//       brand: "MilkyWay",
//       category: "Grocery > Dairy",
//       sku: "MILK-UHT-1L",
//       unitSize: "1 L",
//       priceInINR: 62,
//       mrpInINR: 64,
//       discountPercent: 3,
//       inStock: true,
//       tags: ["grocery", "dairy", "milk", "uht", "1l"]
//     }
//   },
//   {
//     id: "prod-8",
//     title: "Plain Curd 400g",
//     text: "Fresh plain dahi/curd (400g) with active cultures. Price ₹38. Category: Dairy.",
//     url: "https://www.pinelabs.com/products/curd-400g",
//     metadata: {
//       brand: "MilkyWay",
//       category: "Grocery > Dairy",
//       sku: "CURD-PLN-400G",
//       unitSize: "400 g",
//       priceInINR: 38,
//       mrpInINR: 40,
//       discountPercent: 5,
//       inStock: true,
//       tags: ["grocery", "dairy", "curd", "dahi", "400g"]
//     }
//   },
//   {
//     id: "prod-9",
//     title: "Salted Butter 500g",
//     text: "Creamy salted butter (500g). Ideal for cooking and baking. Price ₹285. Category: Dairy.",
//     url: "https://www.pinelabs.com/products/butter-500g",
//     metadata: {
//       brand: "CreamCraft",
//       category: "Grocery > Dairy",
//       sku: "BUT-SALT-500G",
//       unitSize: "500 g",
//       priceInINR: 285,
//       mrpInINR: 299,
//       discountPercent: 5,
//       inStock: true,
//       tags: ["grocery", "dairy", "butter", "500g", "salted"]
//     }
//   },
//   {
//     id: "prod-10",
//     title: "CTC Tea 500g",
//     text: "Strong Assam CTC tea (500g) for a robust cup. Price ₹189. Category: Beverages.",
//     url: "https://www.pinelabs.com/products/ctc-tea-500g",
//     metadata: {
//       brand: "Leaf&Co",
//       category: "Grocery > Beverages",
//       sku: "TEA-CTC-500G",
//       unitSize: "500 g",
//       priceInINR: 189,
//       mrpInINR: 210,
//       discountPercent: 10,
//       inStock: true,
//       tags: ["grocery", "tea", "ctc", "assam", "beverage", "500g"]
//     }
//   },
//   {
//     id: "prod-11",
//     title: "Instant Coffee 200g",
//     text: "100% coffee, freeze-dried granules (200g). Price ₹299. Category: Beverages.",
//     url: "https://www.pinelabs.com/products/coffee-200g",
//     metadata: {
//       brand: "BrewFast",
//       category: "Grocery > Beverages",
//       sku: "COF-INS-200G",
//       unitSize: "200 g",
//       priceInINR: 299,
//       mrpInINR: 349,
//       discountPercent: 14,
//       inStock: true,
//       tags: ["grocery", "coffee", "beverage", "instant", "200g"]
//     }
//   },
//   {
//     id: "prod-12",
//     title: "Masala Biscuits Family Pack",
//     text: "Crispy masala-flavored biscuits, family pack (600g). Price ₹95. Category: Snacks.",
//     url: "https://www.pinelabs.com/products/masala-biscuits-family",
//     metadata: {
//       brand: "SnackMate",
//       category: "Grocery > Snacks",
//       sku: "BISC-MASA-600G",
//       unitSize: "600 g",
//       priceInINR: 95,
//       mrpInINR: 110,
//       discountPercent: 14,
//       inStock: true,
//       tags: ["grocery", "snacks", "biscuits", "family pack", "masala"]
//     }
//   },
//   {
//     id: "prod-13",
//     title: "Rolled Oats 1kg",
//     text: "High-fiber rolled oats (1kg) for healthy breakfasts. Price ₹159. Category: Breakfast & Cereals.",
//     url: "https://www.pinelabs.com/products/oats-1kg",
//     metadata: {
//       brand: "FitStart",
//       category: "Grocery > Breakfast",
//       sku: "OATS-ROL-1KG",
//       unitSize: "1 kg",
//       priceInINR: 159,
//       mrpInINR: 199,
//       discountPercent: 20,
//       inStock: true,
//       tags: ["grocery", "oats", "breakfast", "cereal", "1kg", "healthy"]
//     }
//   },
//   {
//     id: "prod-14",
//     title: "Turmeric Powder 200g",
//     text: "Pure haldi powder (200g). Deep color and aroma. Price ₹69. Category: Spices.",
//     url: "https://www.pinelabs.com/products/turmeric-200g",
//     metadata: {
//       brand: "SpiceWorks",
//       category: "Grocery > Spices",
//       sku: "SPC-TURM-200G",
//       unitSize: "200 g",
//       priceInINR: 69,
//       mrpInINR: 79,
//       discountPercent: 13,
//       inStock: true,
//       tags: ["grocery", "spices", "turmeric", "haldi", "200g"]
//     }
//   },
//   {
//     id: "prod-15",
//     title: "Red Chili Powder 200g",
//     text: "Hot and vibrant red chili powder (200g). Price ₹89. Category: Spices.",
//     url: "https://www.pinelabs.com/products/red-chili-200g",
//     metadata: {
//       brand: "SpiceWorks",
//       category: "Grocery > Spices",
//       sku: "SPC-CHIL-200G",
//       unitSize: "200 g",
//       priceInINR: 89,
//       mrpInINR: 99,
//       discountPercent: 10,
//       inStock: true,
//       tags: ["grocery", "spices", "chili", "lal mirch", "200g"]
//     }
//   },
//   {
//     id: "prod-16",
//     title: "Cumin Seeds 100g",
//     text: "Whole cumin/jeera seeds (100g). Strong aroma. Price ₹49. Category: Spices.",
//     url: "https://www.pinelabs.com/products/cumin-100g",
//     metadata: {
//       brand: "SpiceWorks",
//       category: "Grocery > Spices",
//       sku: "SPC-CUMIN-100G",
//       unitSize: "100 g",
//       priceInINR: 49,
//       mrpInINR: 55,
//       discountPercent: 11,
//       inStock: true,
//       tags: ["grocery", "spices", "cumin", "jeera", "100g"]
//     }
//   },
//   {
//     id: "prod-17",
//     title: "Onion 1kg (Fresh)",
//     text: "Fresh onions (1kg). Daily vegetables. Price ₹34. Category: Produce.",
//     url: "https://www.pinelabs.com/products/onion-1kg",
//     metadata: {
//       brand: "FarmFresh",
//       category: "Grocery > Produce",
//       sku: "VEG-ONION-1KG",
//       unitSize: "1 kg",
//       priceInINR: 34,
//       mrpInINR: 39,
//       discountPercent: 13,
//       inStock: true,
//       tags: ["grocery", "vegetables", "produce", "onion", "pyaaz", "1kg"]
//     }
//   },
//   {
//     id: "prod-18",
//     title: "Tomato 1kg (Fresh)",
//     text: "Ripe red tomatoes (1kg). Price ₹42. Category: Produce.",
//     url: "https://www.pinelabs.com/products/tomato-1kg",
//     metadata: {
//       brand: "FarmFresh",
//       category: "Grocery > Produce",
//       sku: "VEG-TOM-1KG",
//       unitSize: "1 kg",
//       priceInINR: 42,
//       mrpInINR: 48,
//       discountPercent: 12,
//       inStock: true,
//       tags: ["grocery", "vegetables", "produce", "tomato", "tamatar", "1kg"]
//     }
//   },
//   {
//     id: "prod-19",
//     title: "Potato 5kg (Fresh)",
//     text: "Clean potatoes (5kg). Daily staple. Price ₹135. Category: Produce.",
//     url: "https://www.pinelabs.com/products/potato-5kg",
//     metadata: {
//       brand: "FarmFresh",
//       category: "Grocery > Produce",
//       sku: "VEG-POT-5KG",
//       unitSize: "5 kg",
//       priceInINR: 135,
//       mrpInINR: 159,
//       discountPercent: 15,
//       inStock: true,
//       tags: ["grocery", "vegetables", "produce", "potato", "aloo", "5kg"]
//     }
//   },
//   {
//     id: "prod-20",
//     title: "Dishwash Liquid 500ml (Lemon)",
//     text: "Grease-cutting dishwash liquid (500ml), lemon fragrance. Price ₹69. Category: Household.",
//     url: "https://www.pinelabs.com/products/dishwash-500ml",
//     metadata: {
//       brand: "CleanDrop",
//       category: "Household",
//       sku: "HOME-DWASH-500ML",
//       unitSize: "500 ml",
//       priceInINR: 69,
//       mrpInINR: 79,
//       discountPercent: 13,
//       inStock: true,
//       tags: ["household", "cleaning", "dishwash", "lemon", "500ml"]
//     }
//   }
// ];

// /** -------- Helpers -------- */
// const jsonrpcOk   = (id, result) => ({ jsonrpc: '2.0', id, result });
// const jsonrpcErr  = (id, code, message, data) => ({ jsonrpc: '2.0', id, error: { code, message, data } });
// const newSessionId = () => crypto.randomUUID();

// const sessions    = new Map(); // sid -> { createdAt }
// const carts       = new Map(); // sid -> Map<productId, qty>
// const lastOrders  = new Map(); // sid -> { orderId, totalInINR, items, paymentMethod }
// const profiles    = new Map(); // sid -> { email }
// const addrBooks   = new Map(); // sid -> [ { label, line1, line2, city, state, pincode } ]
// const addrSelected= new Map(); // sid -> number (index)
// const paymentPref = new Map(); // sid -> 'ONLINE' | 'COD'
// const coupons     = new Map(); // sid -> { code, discountInINR, percent, freeship }

// /** CHARGES & RULES */
// const SHIPPING_RULE = { threshold: 499, shippingBelow: 30, shippingAtOrAbove: 0 };
// const COD_CHARGE = 60; // add when payment method is COD

// function getSidFromHeaders(req) {
//   return req.header('Mcp-Session-Id') || req.header('MCP-SESSION-ID') || 'anonymous';
// }
// function ensureCart(sid) {
//   if (!carts.has(sid)) carts.set(sid, new Map());
//   return carts.get(sid);
// }
// function ensureAddrBook(sid) {
//   if (!addrBooks.has(sid)) addrBooks.set(sid, []);
//   return addrBooks.get(sid);
// }
// // ---- Seed a default address once per session ----
// function seedDefaultAddressIfMissing(sid) {
//   const book = ensureAddrBook(sid);
//   if (book.length === 0) {
//     book.push({
//       label: 'Home',
//       line1: '315 Noida sector 62',
//       line2: '',
//       city: 'Noida',
//       state: 'Uttar Pradesh',
//       pincode: '201309'
//     });
//     addrSelected.set(sid, 0);
//   }
// }

// function tokenize(q) {
//   return (q || '')
//     .toLowerCase()
//     .split(/[^a-z0-9]+/i)
//     .filter(Boolean);
// }
// function matchesTokens(doc, tokens) {
//   if (!tokens.length) return true;
//   const hay = [
//     doc.title,
//     doc.text,
//     ...(doc.metadata?.tags || []),
//     doc.metadata?.brand || '',
//     doc.metadata?.category || '',
//     doc.metadata?.sku || ''
//   ].join(' ').toLowerCase();
//   return tokens.some(t => hay.includes(t)); // OR match
// }
// function filterCatalog({ q, category, priceMin, priceMax, inStock }) {
//   const tokens = tokenize(q);
//   return catalog.filter(d => {
//     const hasStructuredFilters =
//       (category && category.length) ||
//       (typeof priceMin === 'number') ||
//       (typeof priceMax === 'number') ||
//       (typeof inStock === 'boolean');

//     if (!hasStructuredFilters && !matchesTokens(d, tokens)) return false;

//     if (category && !String(d.metadata?.category || '').toLowerCase().includes(String(category).toLowerCase()))
//       return false;

//     const price = d.metadata?.priceInINR ?? Number.MAX_SAFE_INTEGER;
//     if (typeof priceMin === 'number' && price < priceMin) return false;
//     if (typeof priceMax === 'number' && price > priceMax) return false;

//     if (typeof inStock === 'boolean' && Boolean(d.metadata?.inStock) !== inStock) return false;

//     return true;
//   });
// }
// function summarize(doc) {
//   return {
//     id: doc.id,
//     title: doc.title,
//     url: doc.url,
//     priceInINR: doc.metadata?.priceInINR,
//     unitSize: doc.metadata?.unitSize,
//     inStock: doc.metadata?.inStock
//   };
// }

// /** --- Parser for natural language add-to-cart --- */
// function parseAddTextCommand(raw) {
//   // Example user text: "add Plain Curd qty 2 and Toned Milk qty 1 to cart"
//   const text = String(raw || '').toLowerCase();
//   const cleaned = text.replace(/^add\s+/, '').replace(/\s+to\s+cart\s*$/, '').trim();
//   if (!cleaned) return [];

//   const parts = cleaned.split(/\s+and\s+/i);
//   const items = [];
//   for (const part of parts) {
//     const m = part.match(/\bqty\s+(\d+)\b/i);
//     const qty = m ? parseInt(m[1], 10) : 1;
//     const name = part.replace(/\bqty\s+\d+\b/i, '').trim();
//     if (name) items.push({ name, qty: isNaN(qty) ? 1 : Math.max(1, qty) });
//   }
//   return items;
// }

// /** -------- Health -------- */
// app.get('/health', (req, res) => {
//   res.json({ status: 'healthy', timestamp: new Date().toISOString() });
// });

// /** -------- MCP tools definition (canonical + aliases) -------- */
// function toolsDefinition() {
//   return {
//     tools: [
//       // ===== Inventory & Search =====
//       {
//         name: "inventory_list",
//         title: "List inventory",
//         description: "List grocery items with optional filters. Examples: 'show items under 100', 'list dairy under 100 in-stock'.",
//         inputSchema: {
//           type: "object",
//           properties: {
//             q: { type: "string", description: "Free-text query (e.g., 'milk salt spices')" },
//             category: { type: "string", description: "Substring (e.g., 'Dairy' or 'Grocery > Spices')" },
//             priceMin: { type: "number", description: "Minimum price in INR" },
//             priceMax: { type: "number", description: "Maximum price in INR" },
//             inStock: { type: "boolean", description: "Only in-stock items if true" }
//           },
//           additionalProperties: false
//         },
//         outputSchema: {
//           type: "object",
//           properties: { results: { type: "array", items: { type: "object" } } },
//           required: ["results"],
//           additionalProperties: false
//         }
//       },
//       { // alias
//         name: "inventory/list",
//         title: "List inventory (alias)",
//         description: "Alias of inventory_list.",
//         inputSchema: {
//           type: "object",
//           properties: {
//             q: { type: "string" },
//             category: { type: "string" },
//             priceMin: { type: "number" },
//             priceMax: { type: "number" },
//             inStock: { type: "boolean" }
//           },
//           additionalProperties: false
//         }
//       },
//       {
//         name: "product_search",
//         title: "Search items",
//         description: "Keyword search (token OR match). Detects numbers as price ceilings. Examples: 'under 100', 'buy curd milk salt'.",
//         inputSchema: {
//           type: "object",
//           properties: {
//             query: { type: "string", description: "Free-text (e.g., 'milk under 100')" }
//           },
//           required: ["query"],
//           additionalProperties: false
//         }
//       },
//       { // alias
//         name: "search",
//         title: "Search items (alias)",
//         description: "Alias of product_search.",
//         inputSchema: {
//           type: "object",
//           properties: { query: { type: "string" } },
//           required: ["query"],
//           additionalProperties: false
//         }
//       },
//       {
//         name: "product_fetch",
//         title: "Fetch item details",
//         description: "Fetch full details of a product by ID (e.g., prod-7).",
//         inputSchema: {
//           type: "object",
//           properties: { id: { type: "string", description: "Product ID" } },
//           required: ["id"],
//           additionalProperties: false
//         }
//       },
//       { // alias
//         name: "fetch",
//         title: "Fetch item details (alias)",
//         description: "Alias of product_fetch.",
//         inputSchema: {
//           type: "object",
//           properties: { id: { type: "string" } },
//           required: ["id"],
//           additionalProperties: false
//         }
//       },

//       // ===== Cart =====
//       { 
//         name: "cart_add",
//         title: "Add to cart",
//         description: "Add by id or name. Also accepts natural text to add multiple items (e.g., 'add Plain Curd qty 2 and Toned Milk qty 1 to cart'). Prefer sending the whole user sentence in the 'text' field.",
//         inputSchema: { 
//           type: "object", 
//           properties: {
//             text: { type: "string", description: "Natural sentence to parse, e.g., 'add curd qty 2 and milk qty 1 to cart'" },
//             id:   { type: "string" },
//             name: { type: "string" },
//             qty:  { type: "integer", minimum: 1, default: 1 }
//           }, 
//           additionalProperties: false 
//         } 
//       },
//       { name: "cart_get",   title: "Get cart",   description: "Show cart summary with totals.", inputSchema: { type: "object", additionalProperties: false } },
//       { name: "cart_clear", title: "Clear cart", description: "Remove all items from the cart.", inputSchema: { type: "object", additionalProperties: false } },
//       // alias for cart_add with text support too
//       { 
//         name: "cart/add",
//         title: "Add to cart (alias)",
//         description: "Alias of cart_add. Supports 'text' for natural multi-item adds.",
//         inputSchema: { 
//           type: "object", 
//           properties: {
//             text: { type: "string" },
//             id:   { type: "string" },
//             name: { type: "string" },
//             qty:  { type: "integer", minimum: 1, default: 1 }
//           }, 
//           additionalProperties: false 
//         } 
//       },
//       { name: "cart/get",   title: "Get cart (alias)",   description: "Alias of cart_get.",   inputSchema: { type: "object", additionalProperties: false } },
//       { name: "cart/clear", title: "Clear cart (alias)", description: "Alias of cart_clear.", inputSchema: { type: "object", additionalProperties: false } },

//       // ===== Agentic checkout helpers =====
//       {
//         name: "payment_choose",
//         title: "Choose payment method",
//         description: "Select payment method: ONLINE or COD (COD adds ₹60 delivery charge). Example: {\"method\":\"COD\"}.",
//         inputSchema: {
//           type: "object",
//           properties: { method: { type: "string", enum: ["ONLINE", "COD"] } },
//           required: ["method"],
//           additionalProperties: false
//         }
//       },
//       {
//         name: "profile_set_email",
//         title: "Set buyer email",
//         description: "Save buyer's email for sending Pay-by-Link. Example: {\"email\":\"user@example.com\"}.",
//         inputSchema: {
//           type: "object",
//           properties: { email: { type: "string" } },
//           required: ["email"],
//           additionalProperties: false
//         }
//       },
//       {
//         name: "address_add",
//         title: "Add delivery address",
//         description: "Add a delivery address. Example uses: label, line1, line2, city, state, pincode.",
//         inputSchema: {
//           type: "object",
//           properties: {
//             label: { type: "string" },
//             line1: { type: "string" },
//             line2: { type: "string" },
//             city:  { type: "string" },
//             state: { type: "string" },
//             pincode: { type: "string" }
//           },
//           required: ["line1","city","state","pincode"],
//           additionalProperties: false
//         }
//       },
//       {
//         name: "address_list",
//         title: "List addresses",
//         description: "List saved delivery addresses for selection.",
//         inputSchema: { type: "object", additionalProperties: false }
//       },
//       {
//         name: "address_select",
//         title: "Select address",
//         description: "Select one address by its index returned from address_list. Example: {\"index\":0}.",
//         inputSchema: {
//           type: "object",
//           properties: { index: { type: "integer", minimum: 0 } },
//           required: ["index"],
//           additionalProperties: false
//         }
//       },
//       {
//         name: "coupon_apply",
//         title: "Apply coupon",
//         description: "Apply a coupon code. Examples: SAVE50 (₹50 off), SAVE10 (10% up to ₹100), FREESHIP (shipping free), FIRSTBUY (₹75 off on ≥₹300).",
//         inputSchema: {
//           type: "object",
//           properties: { code: { type: "string" } },
//           required: ["code"],
//           additionalProperties: false
//         }
//       },
//       {
//         name: "checkout_summary",
//         title: "Checkout summary",
//         description: "Show breakdown: items, subtotal, shipping, COD charge (if any), coupon discount, grand total, selected address & payment method.",
//         inputSchema: { type: "object", additionalProperties: false }
//       },

//       // ===== Create order & Pay =====
//       { name: "checkout_create_order", title: "Create order (mock)", description: "Create a mock order from the cart. If no payment selected, defaults to COD. COD adds ₹60 and returns 'Thank you' message.", inputSchema: { type: "object", additionalProperties: false } },
//       {
//         name: "payment_create_link",
//         title: "Create Pay-by-Link (mock)",
//         description: "Generate a mock payment link using buyer email and payable amount. If last order was COD, flips to ONLINE and removes COD charge.",
//         inputSchema: {
//           type: "object",
//           properties: {
//             amountInINR: { type: "number", description: "Override amount; otherwise uses last order total (adjusted)" },
//             email: { type: "string", description: "Override email; otherwise uses saved profile email or default" }
//           },
//           additionalProperties: false
//         }
//       },
//       { name: "checkout_pay", title: "Pay for order (mock)", description: "Complete payment for the most recent order (ONLINE). For COD, payment remains pending.", inputSchema: {
//         type: "object",
//         properties: { orderId: { type: "string" } },
//         additionalProperties: false
//       }},

//       // ===== Old aliases for checkout =====
//       { name: "checkout/create_order",  title: "Create order (alias)", description: "Alias of checkout_create_order.", inputSchema: { type: "object", additionalProperties: false } },
//       { name: "checkout/pay",           title: "Pay for order (alias)", description: "Alias of checkout_pay.", inputSchema: { type: "object", properties: { orderId: { type: "string" } }, additionalProperties: false } }
//     ]
//   };
// }

// /** -------- Tool implementations -------- */
// function tool_inventory_list(args) {
//   const list = filterCatalog({
//     q: args?.q,
//     category: args?.category,
//     priceMin: (typeof args?.priceMin === 'number') ? args.priceMin : undefined,
//     priceMax: (typeof args?.priceMax === 'number') ? args.priceMax : undefined,
//     inStock: (typeof args?.inStock === 'boolean') ? args.inStock : undefined
//   }).map(summarize);

//   return { content: [{ type: 'text', text: JSON.stringify({ results: list }) }] };
// }
// function tool_product_search(args) {
//   const q = args?.query || '';
//   let priceMax;
//   const m = q.match(/\d+/);
//   if (m) priceMax = parseInt(m[0], 10);
//   const qForFilter = (typeof priceMax === 'number') ? '' : q;
//   const list = filterCatalog({ q: qForFilter, priceMax }).map(summarize);
//   return { content: [{ type: 'text', text: JSON.stringify({ results: list }) }] };
// }
// function tool_product_fetch(args) {
//   const id = args?.id;
//   const doc = catalog.find(d => d.id === id);
//   if (!doc) throw { code: -32004, message: `Product with id ${id} not found` };
//   return { content: [{ type: 'text', text: JSON.stringify(doc) }] };
// }
// function tool_cart_add(args, sid) {
//   const cart = ensureCart(sid);

//   // Natural language multi-add (text)
//   if (args?.text) {
//     const parsed = parseAddTextCommand(args.text);
//     if (!parsed.length) throw { code: -32602, message: 'Could not parse items from text' };

//     const added = [];
//     for (const { name, qty } of parsed) {
//       const q = name.toLowerCase();
//       const doc = catalog.find(d =>
//         d.title.toLowerCase().includes(q) ||
//         d.text.toLowerCase().includes(q) ||
//         (d.metadata?.brand || '').toLowerCase().includes(q) ||
//         (d.metadata?.category || '').toLowerCase().includes(q) ||
//         (d.metadata?.tags || []).some(t => t.toLowerCase().includes(q))
//       );
//       if (!doc) continue;
//       const prev = cart.get(doc.id) || 0;
//       cart.set(doc.id, prev + Math.max(1, qty));
//       added.push({ id: doc.id, title: doc.title, qty: Math.max(1, qty) });
//     }
//     if (!added.length) throw { code: -32004, message: 'No matching products found to add' };
//     return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', added }) }] };
//   }

//   // Single add via id/name/qty
//   let { id, name } = args || {};
//   const qty = Math.max(1, parseInt(args?.qty || 1, 10));
//   let doc;
//   if (id) {
//     doc = catalog.find(d => d.id === id);
//   } else if (name) {
//     const q = name.toLowerCase();
//     doc = catalog.find(d =>
//       d.title.toLowerCase().includes(q) ||
//       d.text.toLowerCase().includes(q) ||
//       (d.metadata?.brand || '').toLowerCase().includes(q) ||
//       (d.metadata?.category || '').toLowerCase().includes(q) ||
//       (d.metadata?.tags || []).some(t => t.toLowerCase().includes(q))
//     );
//   }
//   if (!doc) throw { code: -32004, message: `Product not found (provide 'id' or a matching 'name' or 'text')` };

//   const prev = cart.get(doc.id) || 0;
//   cart.set(doc.id, prev + qty);
//   return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', added: { id: doc.id, title: doc.title, qty } }) }] };
// }
// function tool_cart_get(_args, sid) {
//   const cart = ensureCart(sid);
//   const items = [];
//   let subtotal = 0;
//   for (const [id, qty] of cart.entries()) {
//     const d = catalog.find(x => x.id === id);
//     if (!d) continue;
//     const price = d.metadata?.priceInINR || 0;
//     const line = { id, title: d.title, qty, unitPriceInINR: price, totalInINR: price * qty };
//     subtotal += line.totalInINR;
//     items.push(line);
//   }
//   return { content: [{ type: 'text', text: JSON.stringify({ items, subtotalInINR: subtotal }) }] };
// }
// function tool_cart_clear(_args, sid) {
//   carts.set(sid, new Map());
//   return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', cleared: true }) }] };
// }

// /** -------- NEW: Agentic checkout helpers -------- */
// function tool_payment_choose(args, sid) {
//   const method = args?.method;
//   if (!['ONLINE','COD'].includes(method)) throw { code: -32602, message: 'method must be ONLINE or COD' };
//   paymentPref.set(sid, method);
//   return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', method, note: method === 'COD' ? `COD adds ₹${COD_CHARGE} delivery charge` : 'Online payment via Pay-by-Link' }) }] };
// }
// function tool_profile_set_email(args, sid) {
//   const email = String(args?.email || '').trim();
//   if (!email || !email.includes('@')) throw { code: -32602, message: 'Valid email required' };
//   profiles.set(sid, { ...(profiles.get(sid) || {}), email });
//   return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', email }) }] };
// }
// function tool_address_add(args, sid) {
//   const book = ensureAddrBook(sid);
//   const addr = {
//     label: args?.label || `Address ${book.length + 1}`,
//     line1: args.line1, line2: args.line2 || '',
//     city: args.city, state: args.state, pincode: args.pincode
//   };
//   book.push(addr);
//   if (book.length === 1) addrSelected.set(sid, 0);
//   return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', added: addr, count: book.length }) }] };
// }
// function tool_address_list(_args, sid) {
//   const book = ensureAddrBook(sid);
//   const selected = addrSelected.get(sid);
//   return { content: [{ type: 'text', text: JSON.stringify({ addresses: book, selectedIndex: (typeof selected === 'number') ? selected : null }) }] };
// }
// function tool_address_select(args, sid) {
//   const book = ensureAddrBook(sid);
//   const idx = args?.index;
//   if (typeof idx !== 'number' || idx < 0 || idx >= book.length) throw { code: -32602, message: 'Invalid address index' };
//   addrSelected.set(sid, idx);
//   return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', selectedIndex: idx, selected: book[idx] }) }] };
// }
// function computeCart(sid) {
//   const cart = ensureCart(sid);
//   const items = [];
//   let subtotal = 0;
//   for (const [id, qty] of cart.entries()) {
//     const d = catalog.find(x => x.id === id);
//     if (!d) continue;
//     const price = d.metadata?.priceInINR || 0;
//     const lineTotal = price * qty;
//     items.push({ id, title: d.title, qty, unitPriceInINR: price, lineTotalInINR: lineTotal });
//     subtotal += lineTotal;
//   }
//   return { items, subtotalInINR: subtotal };
// }
// function deriveShipping(subtotal, hasFreeShip) {
//   if (hasFreeShip) return 0;
//   return subtotal >= SHIPPING_RULE.threshold ? SHIPPING_RULE.shippingAtOrAbove : SHIPPING_RULE.shippingBelow;
// }
// function applyCouponRules(code, subtotal) {
//   const up = String(code || '').toUpperCase().trim();
//   if (!up) return null;

//   if (up === 'SAVE50') return { code: up, discountInINR: 50 };
//   if (up === 'SAVE10') return { code: up, percent: 10, maxDiscount: 100 };
//   if (up === 'FREESHIP') return { code: up, freeship: true };
//   if (up === 'FIRSTBUY') {
//     if (subtotal >= 300) return { code: up, discountInINR: 75 };
//     return { code: up, discountInINR: 0, note: 'Minimum ₹300 cart required' };
//   }
//   return { code: up, discountInINR: 0, note: 'Invalid/unknown coupon' };
// }
// function computeDiscount(subtotal, coupon) {
//   if (!coupon) return { discount: 0, freeship: false, note: null };
//   if (coupon.percent) {
//     const raw = Math.floor((subtotal * coupon.percent) / 100);
//     const cap = (typeof coupon.maxDiscount === 'number') ? Math.min(raw, coupon.maxDiscount) : raw;
//     return { discount: cap, freeship: false, note: `Applied ${coupon.percent}% (max ${coupon.maxDiscount || '—'})` };
//   }
//   if (coupon.freeship) {
//     return { discount: 0, freeship: true, note: 'Free shipping applied' };
//   }
//   const flat = Math.max(0, coupon.discountInINR || 0);
//   return { discount: flat, freeship: false, note: flat ? `Flat ₹${flat} off` : (coupon.note || null) };
// }
// function tool_coupon_apply(args, sid) {
//   const { items, subtotalInINR } = computeCart(sid);
//   if (items.length === 0) throw { code: -32010, message: 'Cart is empty' };
//   const coupon = applyCouponRules(args?.code, subtotalInINR);
//   coupons.set(sid, coupon || null);
//   const { discount, freeship, note } = computeDiscount(subtotalInINR, coupon);
//   return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', coupon, computed: { discountInINR: discount, freeship, note } }) }] };
// }
// function tool_checkout_summary(_args, sid) {
//   const method = paymentPref.get(sid) || null;
//   const { items, subtotalInINR } = computeCart(sid);
//   const coupon = coupons.get(sid) || null;
//   const d = computeDiscount(subtotalInINR, coupon);
//   const shippingInINR = deriveShipping(subtotalInINR, d.freeship);
//   const codChargeInINR = (method === 'COD') ? COD_CHARGE : 0;
//   const totalInINR = Math.max(0, subtotalInINR - d.discount) + shippingInINR + codChargeInINR;

//   const book = ensureAddrBook(sid);
//   const selectedIdx = addrSelected.get(sid);
//   const selectedAddress = (typeof selectedIdx === 'number') ? book[selectedIdx] : null;
//   const email = (profiles.get(sid) || {}).email || null;

//   const summary = {
//     items, subtotalInINR,
//     coupon, discountInINR: d.discount,
//     shippingInINR, codChargeInINR, totalInINR,
//     paymentMethod: method,
//     email,
//     addressCount: book.length,
//     selectedAddress,
//     merchant: MERCHANT
//   };
//   return { content: [{ type: 'text', text: JSON.stringify(summary) }] };
// }

// /** -------- Create order & Pay -------- */
// // DEFAULT to COD if no payment chosen; COD returns thank-you message
// function tool_checkout_create_order(_args, sid) {
//   const { items, subtotalInINR } = computeCart(sid);
//   if (items.length === 0) throw { code: -32010, message: 'Cart is empty' };

//   // If no payment method, default to COD
// let method = paymentPref.get(sid) || 'ONLINE';
//   paymentPref.set(sid, method);

//   // Address selection
//   const book = ensureAddrBook(sid);
//   if (book.length === 0) throw { code: -32602, message: 'No address available. Add an address before checkout.' };
//   let selectedIdx = addrSelected.get(sid);
//   if (typeof selectedIdx !== 'number') {
//     if (book.length === 1) {
//       addrSelected.set(sid, 0);
//       selectedIdx = 0;
//     } else {
//       throw { code: -32602, message: 'Multiple addresses found. Please select one.' };
//     }
//   }

//   const coupon = coupons.get(sid) || null;
//   const d = computeDiscount(subtotalInINR, coupon);
//   const shippingInINR = deriveShipping(subtotalInINR, d.freeship);
//   const codChargeInINR = (method === 'COD') ? COD_CHARGE : 0;
//   const totalInINR = Math.max(0, subtotalInINR - d.discount) + shippingInINR + codChargeInINR;

//   const orderId = 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase();
//   const summary = {
//     orderId,
//     items,
//     subtotalInINR,
//     discountInINR: d.discount,
//     shippingInINR,
//     codChargeInINR,
//     totalInINR,
//     paymentMethod: method,
//     address: book[selectedIdx],
//     merchant: MERCHANT,
//     status: method === 'COD' ? 'CONFIRMED (COD-PENDING)' : 'CONFIRMED (ONLINE-PAYMENT-PENDING)',
//     message: (method === 'COD')
//       ? `Thank you! Your COD order ${orderId} is confirmed. A ₹${COD_CHARGE} COD delivery charge applies.`
//       : `Order ${orderId} created. Proceed to pay via link.`
//   };

//   // Clear cart after order creation (mock)
//   carts.set(sid, new Map());
//   lastOrders.set(sid, { orderId, totalInINR, items, paymentMethod: method });

//   return { content: [{ type: 'text', text: JSON.stringify(summary) }] };
// }

// // PBL: if last order was COD, flip to ONLINE and remove COD charge from payable
// function tool_payment_create_link(args, sid) {
//   const last = lastOrders.get(sid);
//   if (!last) throw { code: -32011, message: 'No recent order. Create order first.' };

//   let payable = (typeof args?.amountInINR === 'number') ? args.amountInINR : last.totalInINR;
//   if (last.paymentMethod !== 'ONLINE') {
//     payable = Math.max(0, payable - COD_CHARGE);
//     last.paymentMethod = 'ONLINE';
//     lastOrders.set(sid, last);
//   }

//   const prof = profiles.get(sid) || {};
//   const email = (args?.email) || prof.email || 'buyer@example.com';

//   // Dummy PBL (replace with your real API)
//   const paymentLinkUrl = `https://pay.example.com/link/${last.orderId}?amount=${payable}&email=${encodeURIComponent(email)}`;

//   const payload = {
//     orderId: last.orderId,
//     amountInINR: payable,
//     email,
//     merchant: MERCHANT,
//     paymentLinkUrl,
//     note: 'Dummy Pay-by-Link generated. Replace this with your real PBL API.'
//   };
//   return { content: [{ type: 'text', text: JSON.stringify(payload) }] };
// }
// function tool_checkout_pay(args, sid) {
//   const requestedId = args?.orderId;
//   const last = lastOrders.get(sid);
//   const orderId = requestedId || last?.orderId;
//   if (!orderId) throw { code: -32011, message: 'No recent order to pay for.' };

//   const txnId = 'TXN-' + Math.random().toString(36).slice(2, 8).toUpperCase();
//   const paidAt = new Date().toISOString();

//   return { content: [{ type: 'text', text: JSON.stringify({ orderId, transactionId: txnId, paidAt, status: 'PAID (MOCK)' }) }] };
// }

// /** -------- Dispatcher (canonical + alias names) -------- */
// function handleToolsCall(_methodName, params, sid) {
//   const { name, arguments: args } = params || {};
//   switch (name) {
//     // Inventory/Search
//     case 'inventory_list':         return tool_inventory_list(args);
//     case 'product_search':         return tool_product_search(args);
//     case 'product_fetch':          return tool_product_fetch(args);
//     case 'inventory/list':         return tool_inventory_list(args); // alias
//     case 'search':                 return tool_product_search(args); // alias
//     case 'fetch':                  return tool_product_fetch(args);  // alias

//     // Cart
//     case 'cart_add':               return tool_cart_add(args, sid);
//     case 'cart_get':               return tool_cart_get(args, sid);
//     case 'cart_clear':             return tool_cart_clear(args, sid);
//     case 'cart/add':               return tool_cart_add(args, sid);  // alias
//     case 'cart/get':               return tool_cart_get(args, sid);  // alias
//     case 'cart/clear':             return tool_cart_clear(args, sid);// alias

//     // Agentic checkout helpers
//     case 'payment_choose':         return tool_payment_choose(args, sid);
//     case 'profile_set_email':      return tool_profile_set_email(args, sid);
//     case 'address_add':            return tool_address_add(args, sid);
//     case 'address_list':           return tool_address_list(args, sid);
//     case 'address_select':         return tool_address_select(args, sid);
//     case 'coupon_apply':           return tool_coupon_apply(args, sid);
//     case 'checkout_summary':       return tool_checkout_summary(args, sid);

//     // Order & Pay
//     case 'checkout_create_order':  return tool_checkout_create_order(args, sid);
//     case 'payment_create_link':    return tool_payment_create_link(args, sid);
//     case 'checkout_pay':           return tool_checkout_pay(args, sid);
//     case 'checkout/create_order':  return tool_checkout_create_order(args, sid); // alias
//     case 'checkout/pay':           return tool_checkout_pay(args, sid);         // alias

//     default:
//       throw { code: -32601, message: `Unknown tool: ${name}` };
//   }
// }

// /** -------- Streamable HTTP (modern) at /mcp -------- */
// app.post('/mcp', (req, res) => {
//   res.setHeader('MCP-Protocol-Version', '2025-06-18');

//   const { jsonrpc, id, method, params } = req.body || {};
//   if (jsonrpc !== '2.0') {
//     return res.status(400).json(jsonrpcErr(null, -32600, 'Invalid Request'));
//   }

//   try {
//     if (method === 'initialize') {
//       const requestedVersion = params?.protocolVersion || '2025-06-18';
//       const supported = new Set(['2025-06-18', '2025-03-26', '2024-11-05']);
//       const protocolVersion = supported.has(requestedVersion) ? requestedVersion : '2025-06-18';

//       const sid = newSessionId();
//       sessions.set(sid, { createdAt: Date.now() });
//       res.setHeader('Mcp-Session-Id', sid);
//       seedDefaultAddressIfMissing(sid);  // <-- default address for this session

//       return res.json(jsonrpcOk(id, {
//         protocolVersion,
//         capabilities: { tools: { listChanged: true } }, // force rebuild of actions
//         serverInfo: { name: 'Ecommer-pay MCP', title: 'Ecommer-pay Grocery Server', version: '1.0.4' },
//         instructions: 'Flow: Ask payment method (ONLINE/COD). If none is chosen, checkout_create_order defaults to ONLINE. For ONLINE, after order creation call payment_create_link (uses default buyer email if not set). Always show checkout_summary before order. Include merchant info to the user. If user says “add X qty 2 and Y qty 1”, call cart_add with the full sentence in the "text" field.'
//       }));
//     }

//     if (method === 'tools/list') {
//       return res.json(jsonrpcOk(id, toolsDefinition()));
//     }

//     if (method === 'tools/call') {
//     const sid = getSidFromHeaders(req) || 'modern';
//     seedDefaultAddressIfMissing(sid); // <-- ensure default address exists even if client didn't send session id
//     const result = handleToolsCall(method, params, sid);
//     return res.json(jsonrpcOk(id, result));
//     }


//     if (method === 'ping') {
//       return res.json(jsonrpcOk(id, { now: new Date().toISOString() }));
//     }

//     return res.json(jsonrpcErr(id, -32601, `Unknown method: ${method}`));
//   } catch (e) {
//     const { code = -32000, message = 'Internal server error', data } = e || {};
//     return res.json(jsonrpcErr(id, code, message, data));
//   }
// });

// // Optional: GET /mcp SSE (unsolicited notifications)
// app.get('/mcp', (req, res) => {
//   res.writeHead(200, {
//     'Content-Type': 'text/event-stream',
//     'Cache-Control': 'no-cache',
//     'Connection': 'keep-alive',
//     'X-Accel-Buffering': 'no',
//     'Access-Control-Allow-Origin': '*'
//   });
//   res.flushHeaders?.();

//   const note = { jsonrpc: '2.0', method: 'notifications/capabilities', params: toolsDefinition() };
//   res.write(`event: message\n`);
//   res.write(`data: ${JSON.stringify(note)}\n\n`);

//   const keepalive = setInterval(() => res.write(`: ping ${Date.now()}\n\n`), 15000);
//   req.on('close', () => clearInterval(keepalive));
// });

// /** -------- Legacy HTTP+SSE shim at /sse -------- */
// app.get('/sse', (req, res) => {
//   res.writeHead(200, {
//     'Content-Type': 'text/event-stream',
//     'Cache-Control': 'no-cache',
//     'Connection': 'keep-alive',
//     'Access-Control-Allow-Origin': '*',
//     'X-Accel-Buffering': 'no'
//   });
//   res.flushHeaders?.();

//   const postUrl = `${req.protocol}://${req.get('host')}/sse`;
//   res.write(`event: endpoint\n`);
//   res.write(`data: ${JSON.stringify({ url: postUrl })}\n\n`);

//   const capabilitiesMsg = { jsonrpc: '2.0', method: 'notifications/capabilities', params: toolsDefinition() };
//   res.write(`event: message\n`);
//   res.write(`data: ${JSON.stringify(capabilitiesMsg)}\n\n`);

//   const keepalive = setInterval(() => res.write(`: ping ${Date.now()}\n\n`), 15000);
//   req.on('close', () => clearInterval(keepalive));
// });

// app.post('/sse', (req, res) => {
//   const { jsonrpc, id, method, params } = req.body || {};
//   if (jsonrpc !== '2.0') {
//     return res.status(400).json(jsonrpcErr(null, -32600, 'Invalid Request'));
//   }
//   try {
//     if (method === 'initialize') {
//       return res.json(jsonrpcOk(id, {
//         protocolVersion: '2024-11-05',
//         capabilities: { tools: { listChanged: true } },
//         serverInfo: { name: 'Ecommer-pay MCP', title: 'Ecommer-pay Grocery Server (Legacy)', version: '1.0.4' },
//         instructions: 'Flow: Ask payment method (ONLINE/COD). If none is chosen, checkout_create_order defaults to ONLINE. For ONLINE, after order creation call payment_create_link (uses default buyer email if not set). Always show checkout_summary before order. Include merchant info to the user. If user says “add X qty 2 and Y qty 1”, call cart_add with the full sentence in the "text" field.'
//       }));
//     }
//     if (method === 'tools/list') {
//       return res.json(jsonrpcOk(id, toolsDefinition()));
//     }
//     if (method === 'tools/call') {
//       const sid = getSidFromHeaders(req) || 'legacy';
//       seedDefaultAddressIfMissing(sid);
//       const result = handleToolsCall(method, params, sid);
//       return res.json(jsonrpcOk(id, result));
//     }
//     return res.json(jsonrpcErr(id, -32601, `Unknown method: ${method}`));
//   } catch (e) {
//     const { code = -32000, message = 'Internal server error', data } = e || {};
//     return res.json(jsonrpcErr(id, code, message, data));
//   }
// });

// /** -------- Preflight -------- */
// app.options('*', (req, res) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Mcp-Session-Id, MCP-Protocol-Version');
//   res.sendStatus(200);
// });

// /** -------- Start -------- */
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`MCP Server running on port ${PORT}`);
//   console.log(`Health:        http://localhost:${PORT}/health`);
//   console.log(`Modern MCP:    http://localhost:${PORT}/mcp (POST/GET)`);
//   console.log(`Legacy SSE:    http://localhost:${PORT}/sse (GET + POST)`);
// });

// module.exports = app;

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

/** --- Merchant static info (used in PBL + summaries) --- */
const MERCHANT = {
  name: 'Agentic Store',
  supportEmail: 'support@pinelabs.com'
};

/** -------- Catalog (ONE DUMMY PRODUCT; add more later) -------- */
const catalog = [
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

/** -------- Helpers -------- */
const jsonrpcOk   = (id, result) => ({ jsonrpc: '2.0', id, result });
const jsonrpcErr  = (id, code, message, data) => ({ jsonrpc: '2.0', id, error: { code, message, data } });
const newSessionId = () => crypto.randomUUID();

const sessions    = new Map(); // sid -> { createdAt }
const carts       = new Map(); // sid -> Map<productId, qty>
const lastOrders  = new Map(); // sid -> { orderId, totalInINR, items, paymentMethod }
const profiles    = new Map(); // sid -> { email }
const addrBooks   = new Map(); // sid -> [ { label, line1, line2, city, state, pincode } ]
const addrSelected= new Map(); // sid -> number (index)
const paymentPref = new Map(); // sid -> 'ONLINE' | 'COD'
const coupons     = new Map(); // sid -> { code, discountInINR, percent, freeship }

/** CHARGES & RULES */
const SHIPPING_RULE = { threshold: 499, shippingBelow: 30, shippingAtOrAbove: 0 };
const COD_CHARGE = 60; // add when payment method is COD

function getSidFromHeaders(req) {
  return req.header('Mcp-Session-Id') || req.header('MCP-SESSION-ID') || 'anonymous';
}
function ensureCart(sid) {
  if (!carts.has(sid)) carts.set(sid, new Map());
  return carts.get(sid);
}
function ensureAddrBook(sid) {
  if (!addrBooks.has(sid)) addrBooks.set(sid, []);
  return addrBooks.get(sid);
}
// ---- Seed a default address once per session ----
function seedDefaultAddressIfMissing(sid) {
  const book = ensureAddrBook(sid);
  if (book.length === 0) {
    book.push({
      label: 'Home',
      line1: '315 Noida sector 62',
      line2: '',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201309'
    });
    addrSelected.set(sid, 0);
  }
}

function tokenize(q) {
  return (q || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter(Boolean);
}
function matchesTokens(doc, tokens) {
  if (!tokens.length) return true;
  const hay = [
    doc.title,
    doc.text,
    ...(doc.metadata?.tags || []),
    doc.metadata?.brand || '',
    doc.metadata?.category || '',
    doc.metadata?.sku || ''
  ].join(' ').toLowerCase();
  return tokens.some(t => hay.includes(t)); // OR match
}
function filterCatalog({ q, category, priceMin, priceMax, inStock }) {
  const tokens = tokenize(q);
  return catalog.filter(d => {
    const hasStructuredFilters =
      (category && category.length) ||
      (typeof priceMin === 'number') ||
      (typeof priceMax === 'number') ||
      (typeof inStock === 'boolean');

    if (!hasStructuredFilters && !matchesTokens(d, tokens)) return false;

    if (category && !String(d.metadata?.category || '').toLowerCase().includes(String(category).toLowerCase()))
      return false;

    const price = d.metadata?.priceInINR ?? Number.MAX_SAFE_INTEGER;
    if (typeof priceMin === 'number' && price < priceMin) return false;
    if (typeof priceMax === 'number' && price > priceMax) return false;

    if (typeof inStock === 'boolean' && Boolean(d.metadata?.inStock) !== inStock) return false;

    return true;
  });
}
function summarize(doc) {
  return {
    id: doc.id,
    title: doc.title,
    url: doc.url,
    priceInINR: doc.metadata?.priceInINR,
    unitSize: doc.metadata?.unitSize,
    inStock: doc.metadata?.inStock
  };
}

/** --- Parser for natural language add-to-cart --- */
function parseAddTextCommand(raw) {
  // Example user text: "add Plain Curd qty 2 and Toned Milk qty 1 to cart"
  const text = String(raw || '').toLowerCase();
  const cleaned = text.replace(/^add\s+/, '').replace(/\s+to\s+cart\s*$/, '').trim();
  if (!cleaned) return [];

  const parts = cleaned.split(/\s+and\s+/i);
  const items = [];
  for (const part of parts) {
    const m = part.match(/\bqty\s+(\d+)\b/i);
    const qty = m ? parseInt(m[1], 10) : 1;
    const name = part.replace(/\bqty\s+\d+\b/i, '').trim();
    if (name) items.push({ name, qty: isNaN(qty) ? 1 : Math.max(1, qty) });
  }
  return items;
}

/** -------- Health -------- */
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

/** -------- MCP tools definition (canonical + aliases) -------- */
function toolsDefinition() {
  return {
    tools: [
      // ===== Inventory & Search =====
      {
        name: "inventory_list",
        title: "List inventory",
        description: "List grocery items with optional filters. Examples: 'show items under 100', 'list dairy under 100 in-stock'.",
        inputSchema: {
          type: "object",
          properties: {
            q: { type: "string", description: "Free-text query (e.g., 'milk salt spices')" },
            category: { type: "string", description: "Substring (e.g., 'Dairy' or 'Grocery > Spices')" },
            priceMin: { type: "number", description: "Minimum price in INR" },
            priceMax: { type: "number", description: "Maximum price in INR" },
            inStock: { type: "boolean", description: "Only in-stock items if true" }
          },
          additionalProperties: false
        },
        outputSchema: {
          type: "object",
          properties: { results: { type: "array", items: { type: "object" } } },
          required: ["results"],
          additionalProperties: false
        }
      },
      { // alias
        name: "inventory/list",
        title: "List inventory (alias)",
        description: "Alias of inventory_list.",
        inputSchema: {
          type: "object",
          properties: {
            q: { type: "string" },
            category: { type: "string" },
            priceMin: { type: "number" },
            priceMax: { type: "number" },
            inStock: { type: "boolean" }
          },
          additionalProperties: false
        }
      },
      {
        name: "product_search",
        title: "Search items",
        description: "Keyword search (token OR match). Detects numbers as price ceilings. Examples: 'under 100', 'buy curd milk salt'.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Free-text (e.g., 'milk under 100')" }
          },
          required: ["query"],
          additionalProperties: false
        }
      },
      { // alias
        name: "search",
        title: "Search items (alias)",
        description: "Alias of product_search.",
        inputSchema: {
          type: "object",
          properties: { query: { type: "string" } },
          required: ["query"],
          additionalProperties: false
        }
      },
      {
        name: "product_fetch",
        title: "Fetch item details",
        description: "Fetch full details of a product by ID (e.g., prod-7). NOT for checkout. If user says 'checkout' or 'proceed to checkout', use the 'checkout' tool (alias of checkout_create_order) instead.",
        inputSchema: {
          type: "object",
          properties: { id: { type: "string", description: "Product ID" } },
          required: ["id"],
          additionalProperties: false
        }
      },
      { // alias
        name: "fetch",
        title: "Fetch item details (alias)",
        description: "Alias of product_fetch.",
        inputSchema: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
          additionalProperties: false
        }
      },

      // ===== Cart =====
      { 
        name: "cart_add",
        title: "Add to cart",
        description: "Add by id or name. Also accepts natural text to add multiple items (e.g., 'add Plain Curd qty 2 and Toned Milk qty 1 to cart'). Prefer sending the whole user sentence in the 'text' field.",
        inputSchema: { 
          type: "object", 
          properties: {
            text: { type: "string", description: "Natural sentence to parse, e.g., 'add curd qty 2 and milk qty 1 to cart'" },
            id:   { type: "string" },
            name: { type: "string" },
            qty:  { type: "integer", minimum: 1, default: 1 }
          }, 
          additionalProperties: false 
        } 
      },
      { name: "cart_get",   title: "Get cart",   description: "Show cart summary with totals.", inputSchema: { type: "object", additionalProperties: false } },
      { name: "cart_clear", title: "Clear cart", description: "Remove all items from the cart.", inputSchema: { type: "object", additionalProperties: false } },
      { // alias for cart_add with text support too
        name: "cart/add",
        title: "Add to cart (alias)",
        description: "Alias of cart_add. Supports 'text' for natural multi-item adds.",
        inputSchema: { 
          type: "object", 
          properties: {
            text: { type: "string" },
            id:   { type: "string" },
            name: { type: "string" },
            qty:  { type: "integer", minimum: 1, default: 1 }
          }, 
          additionalProperties: false 
        } 
      },
      { name: "cart/get",   title: "Get cart (alias)",   description: "Alias of cart_get.",   inputSchema: { type: "object", additionalProperties: false } },
      { name: "cart/clear", title: "Clear cart (alias)", description: "Alias of cart_clear.", inputSchema: { type: "object", additionalProperties: false } },

      // ===== Agentic checkout helpers =====
      {
        name: "payment_choose",
        title: "Choose payment method",
        description: "Select payment method: ONLINE or COD (COD adds ₹60 delivery charge). Example: {\"method\":\"COD\"}.",
        inputSchema: {
          type: "object",
          properties: { method: { type: "string", enum: ["ONLINE", "COD"] } },
          required: ["method"],
          additionalProperties: false
        }
      },
      {
        name: "profile_set_email",
        title: "Set buyer email",
        description: "Save buyer's email for sending Pay-by-Link. Example: {\"email\":\"user@example.com\"}.",
        inputSchema: {
          type: "object",
          properties: { email: { type: "string" } },
          required: ["email"],
          additionalProperties: false
        }
      },
      {
        name: "address_add",
        title: "Add delivery address",
        description: "Add a delivery address. Example uses: label, line1, line2, city, state, pincode.",
        inputSchema: {
          type: "object",
          properties: {
            label: { type: "string" },
            line1: { type: "string" },
            line2: { type: "string" },
            city:  { type: "string" },
            state: { type: "string" },
            pincode: { type: "string" }
          },
          required: ["line1","city","state","pincode"],
          additionalProperties: false
        }
      },
      {
        name: "address_list",
        title: "List addresses",
        description: "List saved delivery addresses for selection.",
        inputSchema: { type: "object", additionalProperties: false }
      },
      {
        name: "address_select",
        title: "Select address",
        description: "Select one address by its index returned from address_list. Example: {\"index\":0}.",
        inputSchema: {
          type: "object",
          properties: { index: { type: "integer", minimum: 0 } },
          required: ["index"],
          additionalProperties: false
        }
      },
      {
        name: "coupon_apply",
        title: "Apply coupon",
        description: "Apply a coupon code. Examples: SAVE50 (₹50 off), SAVE10 (10% up to ₹100), FREESHIP (shipping free), FIRSTBUY (₹75 off on ≥₹300).",
        inputSchema: {
          type: "object",
          properties: { code: { type: "string" } },
          required: ["code"],
          additionalProperties: false
        }
      },
      {
        name: "checkout_summary",
        title: "Checkout summary",
        description: "Show breakdown: items, subtotal, shipping, COD charge (if any), coupon discount, grand total, selected address & payment method.",
        inputSchema: { type: "object", additionalProperties: false }
      },

      // ===== Create order & Pay =====
      { name: "checkout_create_order", title: "Create order (mock)", description: "Create a mock order from the cart. If no payment selected, defaults to ONLINE. COD adds ₹60 and returns 'Thank you' message.", inputSchema: { type: "object", additionalProperties: false } },

      // ---- Friendly natural-language aliases for checkout ----
      { name: "checkout",              title: "Proceed to checkout", description: "Alias of checkout_create_order. Use when user says 'checkout' / 'proceed to checkout' / 'place the order'.", inputSchema: { type: "object", additionalProperties: false } },
      { name: "proceed_to_checkout",   title: "Proceed to checkout (alt)", description: "Alias of checkout_create_order.", inputSchema: { type: "object", additionalProperties: false } },
      { name: "place_order",           title: "Place order", description: "Alias of checkout_create_order.", inputSchema: { type: "object", additionalProperties: false } },

      {
        name: "payment_create_link",
        title: "Create Pay-by-Link (mock)",
        description: "Generate a mock payment link using buyer email and payable amount. If last order was COD, flips to ONLINE and removes COD charge.",
        inputSchema: {
          type: "object",
          properties: {
            amountInINR: { type: "number", description: "Override amount; otherwise uses last order total (adjusted)" },
            email: { type: "string", description: "Override email; otherwise uses saved profile email or default" }
          },
          additionalProperties: false
        }
      },
      { name: "checkout_pay", title: "Pay for order (mock)", description: "Complete payment for the most recent order (ONLINE). For COD, payment remains pending.", inputSchema: {
        type: "object",
        properties: { orderId: { type: "string" } },
        additionalProperties: false
      }},

      // ===== Old aliases =====
      { name: "checkout/create_order",  title: "Create order (alias)", description: "Alias of checkout_create_order.", inputSchema: { type: "object", additionalProperties: false } },
      { name: "checkout/pay",           title: "Pay for order (alias)", description: "Alias of checkout_pay.", inputSchema: { type: "object", properties: { orderId: { type: "string" } }, additionalProperties: false } }
    ]
  };
}

/** -------- Tool implementations -------- */
function tool_inventory_list(args) {
  const list = filterCatalog({
    q: args?.q,
    category: args?.category,
    priceMin: (typeof args?.priceMin === 'number') ? args.priceMin : undefined,
    priceMax: (typeof args?.priceMax === 'number') ? args.priceMax : undefined,
    inStock: (typeof args?.inStock === 'boolean') ? args.inStock : undefined
  }).map(summarize);

  return { content: [{ type: 'text', text: JSON.stringify({ results: list }) }] };
}
function tool_product_search(args) {
  const q = args?.query || '';
  let priceMax;
  const m = q.match(/\d+/);
  if (m) priceMax = parseInt(m[0], 10);
  const qForFilter = (typeof priceMax === 'number') ? '' : q;
  const list = filterCatalog({ q: qForFilter, priceMax }).map(summarize);
  return { content: [{ type: 'text', text: JSON.stringify({ results: list }) }] };
}
function tool_product_fetch(args) {
  const id = args?.id;
  const doc = catalog.find(d => d.id === id);
  if (!doc) throw { code: -32004, message: `Product with id ${id} not found` };
  return { content: [{ type: 'text', text: JSON.stringify(doc) }] };
}
function tool_cart_add(args, sid) {
  const cart = ensureCart(sid);

  // Natural language multi-add (text)
  if (args?.text) {
    const parsed = parseAddTextCommand(args.text);
    if (!parsed.length) throw { code: -32602, message: 'Could not parse items from text' };

    const added = [];
    for (const { name, qty } of parsed) {
      const q = name.toLowerCase();
      const doc = catalog.find(d =>
        d.title.toLowerCase().includes(q) ||
        d.text.toLowerCase().includes(q) ||
        (d.metadata?.brand || '').toLowerCase().includes(q) ||
        (d.metadata?.category || '').toLowerCase().includes(q) ||
        (d.metadata?.tags || []).some(t => t.toLowerCase().includes(q))
      );
      if (!doc) continue;
      const prev = cart.get(doc.id) || 0;
      cart.set(doc.id, prev + Math.max(1, qty));
      added.push({ id: doc.id, title: doc.title, qty: Math.max(1, qty) });
    }
    if (!added.length) throw { code: -32004, message: 'No matching products found to add' };
    return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', added }) }] };
  }

  // Single add via id/name/qty
  let { id, name } = args || {};
  const qty = Math.max(1, parseInt(args?.qty || 1, 10));
  let doc;
  if (id) {
    doc = catalog.find(d => d.id === id);
  } else if (name) {
    const q = name.toLowerCase();
    doc = catalog.find(d =>
      d.title.toLowerCase().includes(q) ||
      d.text.toLowerCase().includes(q) ||
      (d.metadata?.brand || '').toLowerCase().includes(q) ||
      (d.metadata?.category || '').toLowerCase().includes(q) ||
      (d.metadata?.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }
  if (!doc) throw { code: -32004, message: `Product not found (provide 'id' or a matching 'name' or 'text')` };

  const prev = cart.get(doc.id) || 0;
  cart.set(doc.id, prev + qty);
  return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', added: { id: doc.id, title: doc.title, qty } }) }] };
}
function tool_cart_get(_args, sid) {
  const cart = ensureCart(sid);
  const items = [];
  let subtotal = 0;
  for (const [id, qty] of cart.entries()) {
    const d = catalog.find(x => x.id === id);
    if (!d) continue;
    const price = d.metadata?.priceInINR || 0;
    const line = { id, title: d.title, qty, unitPriceInINR: price, totalInINR: price * qty };
    subtotal += line.totalInINR;
    items.push(line);
  }
  return { content: [{ type: 'text', text: JSON.stringify({ items, subtotalInINR: subtotal }) }] };
}
function tool_cart_clear(_args, sid) {
  carts.set(sid, new Map());
  return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', cleared: true }) }] };
}

/** -------- NEW: Agentic checkout helpers -------- */
function tool_payment_choose(args, sid) {
  const method = args?.method;
  if (!['ONLINE','COD'].includes(method)) throw { code: -32602, message: 'method must be ONLINE or COD' };
  paymentPref.set(sid, method);
  return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', method, note: method === 'COD' ? `COD adds ₹${COD_CHARGE} delivery charge` : 'Online payment via Pay-by-Link' }) }] };
}
function tool_profile_set_email(args, sid) {
  const email = String(args?.email || '').trim();
  if (!email || !email.includes('@')) throw { code: -32602, message: 'Valid email required' };
  profiles.set(sid, { ...(profiles.get(sid) || {}), email });
  return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', email }) }] };
}
function tool_address_add(args, sid) {
  const book = ensureAddrBook(sid);
  const addr = {
    label: args?.label || `Address ${book.length + 1}`,
    line1: args.line1, line2: args.line2 || '',
    city: args.city, state: args.state, pincode: args.pincode
  };
  book.push(addr);
  if (book.length === 1) addrSelected.set(sid, 0);
  return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', added: addr, count: book.length }) }] };
}
function tool_address_list(_args, sid) {
  const book = ensureAddrBook(sid);
  const selected = addrSelected.get(sid);
  return { content: [{ type: 'text', text: JSON.stringify({ addresses: book, selectedIndex: (typeof selected === 'number') ? selected : null }) }] };
}
function tool_address_select(args, sid) {
  const book = ensureAddrBook(sid);
  const idx = args?.index;
  if (typeof idx !== 'number' || idx < 0 || idx >= book.length) throw { code: -32602, message: 'Invalid address index' };
  addrSelected.set(sid, idx);
  return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', selectedIndex: idx, selected: book[idx] }) }] };
}
function computeCart(sid) {
  const cart = ensureCart(sid);
  const items = [];
  let subtotal = 0;
  for (const [id, qty] of cart.entries()) {
    const d = catalog.find(x => x.id === id);
    if (!d) continue;
    const price = d.metadata?.priceInINR || 0;
    const lineTotal = price * qty;
    items.push({ id, title: d.title, qty, unitPriceInINR: price, lineTotalInINR: lineTotal });
    subtotal += lineTotal;
  }
  return { items, subtotalInINR: subtotal };
}
function deriveShipping(subtotal, hasFreeShip) {
  if (hasFreeShip) return 0;
  return subtotal >= SHIPPING_RULE.threshold ? SHIPPING_RULE.shippingAtOrAbove : SHIPPING_RULE.shippingBelow;
}
function applyCouponRules(code, subtotal) {
  const up = String(code || '').toUpperCase().trim();
  if (!up) return null;

  if (up === 'SAVE50') return { code: up, discountInINR: 50 };
  if (up === 'SAVE10') return { code: up, percent: 10, maxDiscount: 100 };
  if (up === 'FREESHIP') return { code: up, freeship: true };
  if (up === 'FIRSTBUY') {
    if (subtotal >= 300) return { code: up, discountInINR: 75 };
    return { code: up, discountInINR: 0, note: 'Minimum ₹300 cart required' };
  }
  return { code: up, discountInINR: 0, note: 'Invalid/unknown coupon' };
}
function computeDiscount(subtotal, coupon) {
  if (!coupon) return { discount: 0, freeship: false, note: null };
  if (coupon.percent) {
    const raw = Math.floor((subtotal * coupon.percent) / 100);
    const cap = (typeof coupon.maxDiscount === 'number') ? Math.min(raw, coupon.maxDiscount) : raw;
    return { discount: cap, freeship: false, note: `Applied ${coupon.percent}% (max ${coupon.maxDiscount || '—'})` };
  }
  if (coupon.freeship) {
    return { discount: 0, freeship: true, note: 'Free shipping applied' };
  }
  const flat = Math.max(0, coupon.discountInINR || 0);
  return { discount: flat, freeship: false, note: flat ? `Flat ₹${flat} off` : (coupon.note || null) };
}
function tool_coupon_apply(args, sid) {
  const { items, subtotalInINR } = computeCart(sid);
  if (items.length === 0) throw { code: -32010, message: 'Cart is empty' };
  const coupon = applyCouponRules(args?.code, subtotalInINR);
  coupons.set(sid, coupon || null);
  const { discount, freeship, note } = computeDiscount(subtotalInINR, coupon);
  return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', coupon, computed: { discountInINR: discount, freeship, note } }) }] };
}
function tool_checkout_summary(_args, sid) {
  const method = paymentPref.get(sid) || null;
  const { items, subtotalInINR } = computeCart(sid);
  const coupon = coupons.get(sid) || null;
  const d = computeDiscount(subtotalInINR, coupon);
  const shippingInINR = deriveShipping(subtotalInINR, d.freeship);
  const codChargeInINR = (method === 'COD') ? COD_CHARGE : 0;
  const totalInINR = Math.max(0, subtotalInINR - d.discount) + shippingInINR + codChargeInINR;

  const book = ensureAddrBook(sid);
  const selectedIdx = addrSelected.get(sid);
  const selectedAddress = (typeof selectedIdx === 'number') ? book[selectedIdx] : null;
  const email = (profiles.get(sid) || {}).email || null;

  const summary = {
    items, subtotalInINR,
    coupon, discountInINR: d.discount,
    shippingInINR, codChargeInINR, totalInINR,
    paymentMethod: method,
    email,
    addressCount: book.length,
    selectedAddress,
    merchant: MERCHANT
  };
  return { content: [{ type: 'text', text: JSON.stringify(summary) }] };
}

/** -------- Create order & Pay -------- */
// DEFAULT to ONLINE if no payment chosen
function tool_checkout_create_order(_args, sid) {
  const { items, subtotalInINR } = computeCart(sid);
  if (items.length === 0) throw { code: -32010, message: 'Cart is empty' };

  // If no payment method, default to ONLINE
  let method = paymentPref.get(sid) || 'ONLINE';
  paymentPref.set(sid, method);

  // Address selection
  const book = ensureAddrBook(sid);
  if (book.length === 0) throw { code: -32602, message: 'No address available. Add an address before checkout.' };
  let selectedIdx = addrSelected.get(sid);
  if (typeof selectedIdx !== 'number') {
    if (book.length === 1) {
      addrSelected.set(sid, 0);
      selectedIdx = 0;
    } else {
      throw { code: -32602, message: 'Multiple addresses found. Please select one.' };
    }
  }

  const coupon = coupons.get(sid) || null;
  const d = computeDiscount(subtotalInINR, coupon);
  const shippingInINR = deriveShipping(subtotalInINR, d.freeship);
  const codChargeInINR = (method === 'COD') ? COD_CHARGE : 0;
  const totalInINR = Math.max(0, subtotalInINR - d.discount) + shippingInINR + codChargeInINR;

  const orderId = 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const summary = {
    orderId,
    items,
    subtotalInINR,
    discountInINR: d.discount,
    shippingInINR,
    codChargeInINR,
    totalInINR,
    paymentMethod: method,
    address: book[selectedIdx],
    merchant: MERCHANT,
    status: method === 'COD' ? 'CONFIRMED (COD-PENDING)' : 'CONFIRMED (ONLINE-PAYMENT-PENDING)',
    message: (method === 'COD')
      ? `Thank you! Your COD order ${orderId} is confirmed. A ₹${COD_CHARGE} COD delivery charge applies.`
      : `Order ${orderId} created. Proceed to pay via link.`
  };

  // Clear cart after order creation (mock)
  carts.set(sid, new Map());
  lastOrders.set(sid, { orderId, totalInINR, items, paymentMethod: method });

  return { content: [{ type: 'text', text: JSON.stringify(summary) }] };
}

// PBL: if last order was COD, flip to ONLINE and remove COD charge from payable
function tool_payment_create_link(args, sid) {
  const last = lastOrders.get(sid);
  if (!last) throw { code: -32011, message: 'No recent order. Create order first.' };

  let payable = (typeof args?.amountInINR === 'number') ? args.amountInINR : last.totalInINR;
  if (last.paymentMethod !== 'ONLINE') {
    payable = Math.max(0, payable - COD_CHARGE);
    last.paymentMethod = 'ONLINE';
    lastOrders.set(sid, last);
  }

  const prof = profiles.get(sid) || {};
  const email = (args?.email) || prof.email || 'buyer@example.com';

  // Dummy PBL (replace with your real API)
  const paymentLinkUrl = `https://pay.example.com/link/${last.orderId}?amount=${payable}&email=${encodeURIComponent(email)}`;

  const payload = {
    orderId: last.orderId,
    amountInINR: payable,
    email,
    merchant: MERCHANT,
    paymentLinkUrl,
    note: 'Dummy Pay-by-Link generated. Replace this with your real PBL API.'
  };
  return { content: [{ type: 'text', text: JSON.stringify(payload) }] };
}
function tool_checkout_pay(args, sid) {
  const requestedId = args?.orderId;
  const last = lastOrders.get(sid);
  const orderId = requestedId || last?.orderId;
  if (!orderId) throw { code: -32011, message: 'No recent order to pay for.' };

  const txnId = 'TXN-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const paidAt = new Date().toISOString();

  return { content: [{ type: 'text', text: JSON.stringify({ orderId, transactionId: txnId, paidAt, status: 'PAID (MOCK)' }) }] };
}

/** -------- Dispatcher (canonical + alias names) -------- */
function handleToolsCall(_methodName, params, sid) {
  const { name, arguments: args } = params || {};
  switch (name) {
    // Inventory/Search
    case 'inventory_list':         return tool_inventory_list(args);
    case 'product_search':         return tool_product_search(args);
    case 'product_fetch':          return tool_product_fetch(args);
    case 'inventory/list':         return tool_inventory_list(args); // alias
    case 'search':                 return tool_product_search(args); // alias
    case 'fetch':                  return tool_product_fetch(args);  // alias

    // Cart
    case 'cart_add':               return tool_cart_add(args, sid);
    case 'cart_get':               return tool_cart_get(args, sid);
    case 'cart_clear':             return tool_cart_clear(args, sid);
    case 'cart/add':               return tool_cart_add(args, sid);  // alias
    case 'cart/get':               return tool_cart_get(args, sid);  // alias
    case 'cart/clear':             return tool_cart_clear(args, sid);// alias

    // Agentic checkout helpers
    case 'payment_choose':         return tool_payment_choose(args, sid);
    case 'profile_set_email':      return tool_profile_set_email(args, sid);
    case 'address_add':            return tool_address_add(args, sid);
    case 'address_list':           return tool_address_list(args, sid);
    case 'address_select':         return tool_address_select(args, sid);
    case 'coupon_apply':           return tool_coupon_apply(args, sid);
    case 'checkout_summary':       return tool_checkout_summary(args, sid);

    // Order & Pay
    case 'checkout_create_order':  return tool_checkout_create_order(args, sid);
    case 'checkout':               return tool_checkout_create_order(args, sid); // natural alias
    case 'proceed_to_checkout':    return tool_checkout_create_order(args, sid); // natural alias
    case 'place_order':            return tool_checkout_create_order(args, sid); // natural alias
    case 'payment_create_link':    return tool_payment_create_link(args, sid);
    case 'checkout_pay':           return tool_checkout_pay(args, sid);
    case 'checkout/create_order':  return tool_checkout_create_order(args, sid); // old alias
    case 'checkout/pay':           return tool_checkout_pay(args, sid);         // old alias

    default:
      throw { code: -32601, message: `Unknown tool: ${name}` };
  }
}

/** -------- Streamable HTTP (modern) at /mcp -------- */
app.post('/mcp', (req, res) => {
  res.setHeader('MCP-Protocol-Version', '2025-06-18');

  const { jsonrpc, id, method, params } = req.body || {};
  if (jsonrpc !== '2.0') {
    return res.status(400).json(jsonrpcErr(null, -32600, 'Invalid Request'));
  }

  try {
    if (method === 'initialize') {
      const requestedVersion = params?.protocolVersion || '2025-06-18';
      const supported = new Set(['2025-06-18', '2025-03-26', '2024-11-05']);
      const protocolVersion = supported.has(requestedVersion) ? requestedVersion : '2025-06-18';

      const sid = newSessionId();
      sessions.set(sid, { createdAt: Date.now() });
      res.setHeader('Mcp-Session-Id', sid);
      seedDefaultAddressIfMissing(sid);  // <-- default address for this session

      return res.json(jsonrpcOk(id, {
        protocolVersion,
        capabilities: { tools: { listChanged: true } }, // force rebuild of actions
        serverInfo: { name: 'Ecommer-pay MCP', title: 'Ecommer-pay Grocery Server', version: '1.0.5' },
        instructions: 'Flow: Ask payment method (ONLINE/COD). If none is chosen, checkout_create_order defaults to ONLINE. After order creation, call payment_create_link for ONLINE (uses default buyer email if not set). Always show checkout_summary before order. Include merchant info. If user says “proceed to checkout” or “checkout”, call the tool named checkout (alias of checkout_create_order). If user says “add X qty 2 and Y qty 1”, call cart_add with the full sentence in the "text" field.'
      }));
    }

    if (method === 'tools/list') {
      return res.json(jsonrpcOk(id, toolsDefinition()));
    }

    if (method === 'tools/call') {
      const sid = getSidFromHeaders(req) || 'modern';
      seedDefaultAddressIfMissing(sid); // ensure default address exists even if client didn't send session id
      const result = handleToolsCall(method, params, sid);
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

// Optional: GET /mcp SSE (unsolicited notifications)
app.get('/mcp', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': '*'
  });
  res.flushHeaders?.();

  const note = { jsonrpc: '2.0', method: 'notifications/capabilities', params: toolsDefinition() };
  res.write(`event: message\n`);
  res.write(`data: ${JSON.stringify(note)}\n\n`);

  const keepalive = setInterval(() => res.write(`: ping ${Date.now()}\n\n`), 15000);
  req.on('close', () => clearInterval(keepalive));
});

/** -------- Legacy HTTP+SSE shim at /sse -------- */
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
  res.write(`event: endpoint\n`);
  res.write(`data: ${JSON.stringify({ url: postUrl })}\n\n`);

  const capabilitiesMsg = { jsonrpc: '2.0', method: 'notifications/capabilities', params: toolsDefinition() };
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
        capabilities: { tools: { listChanged: true } },
        serverInfo: { name: 'Ecommer-pay MCP', title: 'Ecommer-pay Grocery Server (Legacy)', version: '1.0.5' },
        instructions: 'Flow: Ask payment method (ONLINE/COD). If none is chosen, checkout_create_order defaults to ONLINE. After order creation, call payment_create_link for ONLINE (uses default buyer email if not set). Always show checkout_summary before order. Include merchant info. If user says “proceed to checkout” or “checkout”, call the tool named checkout (alias of checkout_create_order). If user says “add X qty 2 and Y qty 1”, call cart_add with the full sentence in the "text" field.'
      }));
    }
    if (method === 'tools/list') {
      return res.json(jsonrpcOk(id, toolsDefinition()));
    }
    if (method === 'tools/call') {
      const sid = getSidFromHeaders(req) || 'legacy';
      seedDefaultAddressIfMissing(sid);
      const result = handleToolsCall(method, params, sid);
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

/** -------- Start -------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`Health:        http://localhost:${PORT}/health`);
  console.log(`Modern MCP:    http://localhost:${PORT}/mcp (POST/GET)`);
  console.log(`Legacy SSE:    http://localhost:${PORT}/sse (GET + POST)`);
});

module.exports = app;
