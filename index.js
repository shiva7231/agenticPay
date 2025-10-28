// index.js
const express = require('express');
const cors = require('cors');

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

/** -------- Product Catalog -------- */
const products = [
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

/** -------- Global Cart and Orders (Simple - No Sessions) -------- */
const globalCart = { items: [] };
const globalOrders = [];

/** -------- Helper Functions -------- */

// Generate unique order ID
function generateOrderId() {
  return `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Calculate cart summary with pricing details
function calculateCartSummary(cartItems) {
  let subtotal = 0;
  let totalMrp = 0;
  let totalSavings = 0;
  let itemCount = 0;

  for (const item of cartItems) {
    const lineTotal = item.unitPrice * item.quantity;
    const lineMrp = item.unitMrp * item.quantity;

    subtotal += lineTotal;
    totalMrp += lineMrp;
    itemCount += item.quantity;
  }

  totalSavings = totalMrp - subtotal;

  return {
    subtotal,
    totalMrp,
    totalSavings,
    finalAmount: subtotal,
    itemCount
  };
}

// Get cart with full product details
function getCartWithDetails() {
  const cartItems = globalCart.items;

  const itemsWithDetails = cartItems.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    if (!product) {
      // Skip items for products that no longer exist
      return null;
    }

    return {
      productId: product.id,
      title: product.title,
      quantity: cartItem.quantity,
      unitPrice: product.metadata.priceInINR,
      unitMrp: product.metadata.mrpInINR,
      lineTotal: product.metadata.priceInINR * cartItem.quantity,
      lineSavings: (product.metadata.mrpInINR - product.metadata.priceInINR) * cartItem.quantity
    };
  }).filter(item => item !== null);

  const summary = calculateCartSummary(itemsWithDetails);

  return {
    items: itemsWithDetails,
    summary
  };
}

/** -------- Health & info -------- */
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/capabilities', (req, res) => {
  res.json({
    capabilities: {
      tools: [
        {
          name: "search_products",
          description: "Search through a catalog of Indian grocery products. Returns matching products with ID, title, and URL."
        },
        {
          name: "get_product_details",
          description: "Retrieve complete information about a specific grocery product by its ID including pricing, brand, category, and stock availability."
        },
        {
          name: "add_to_cart",
          description: "Add a grocery product to the shopping cart with specified quantity. Validates stock and returns updated cart summary."
        },
        {
          name: "remove_from_cart",
          description: "Remove a product completely from the shopping cart. Returns updated cart summary."
        },
        {
          name: "get_cart",
          description: "View current shopping cart contents with full details including items, quantities, prices, and totals."
        },
        {
          name: "clear_cart",
          description: "Empty the entire shopping cart, removing all items."
        },
        {
          name: "checkout",
          description: "Process checkout and create a completed order from cart contents. Returns order ID and clears cart."
        },
        {
          name: "get_order_summary",
          description: "Retrieve details of a previously completed order by its order ID."
        }
      ]
    }
  });
});

/** -------- Cart Handler Functions -------- */

// Add product to cart
function handleAddToCart(productId, quantity) {
  if (!productId) {
    throw { code: -32002, message: 'Product ID is required' };
  }

  if (!quantity || quantity < 1) {
    throw { code: -32003, message: 'Quantity must be a positive integer' };
  }

  // Validate product exists
  const product = products.find(p => p.id === productId);
  if (!product) {
    throw { code: -32004, message: `Product with id ${productId} not found` };
  }

  // Check stock availability
  if (!product.metadata.inStock) {
    throw { code: -32005, message: `Product ${product.title} is currently out of stock` };
  }

  // Check if product already in cart
  const existingItem = globalCart.items.find(item => item.productId === productId);

  if (existingItem) {
    // Add to existing quantity
    existingItem.quantity += quantity;
  } else {
    // Add new item
    globalCart.items.push({ productId, quantity });
  }

  // Get updated cart details
  const cartDetails = getCartWithDetails();

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        success: true,
        message: `Added ${quantity}x ${product.title} to cart`,
        cart: cartDetails
      })
    }]
  };
}

// Remove product from cart
function handleRemoveFromCart(productId) {
  if (!productId) {
    throw { code: -32002, message: 'Product ID is required' };
  }

  const itemIndex = globalCart.items.findIndex(item => item.productId === productId);

  if (itemIndex === -1) {
    throw { code: -32006, message: `Product ${productId} not found in cart` };
  }

  // Get product title before removing
  const product = products.find(p => p.id === productId);
  const productTitle = product ? product.title : productId;

  // Remove item
  globalCart.items.splice(itemIndex, 1);

  // Get updated cart details
  const cartDetails = getCartWithDetails();

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        success: true,
        message: `Removed ${productTitle} from cart`,
        cart: cartDetails
      })
    }]
  };
}

// Get cart details
function handleGetCart() {
  const cartDetails = getCartWithDetails();

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(cartDetails)
    }]
  };
}

// Clear cart
function handleClearCart() {
  const itemCount = globalCart.items.length;

  globalCart.items = [];

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        success: true,
        message: `Cart cleared. Removed ${itemCount} item(s).`
      })
    }]
  };
}

// Checkout and create order
function handleCheckout() {
  // Validate cart is not empty
  if (globalCart.items.length === 0) {
    throw { code: -32007, message: 'Cannot checkout with empty cart' };
  }

  // Get cart details
  const cartDetails = getCartWithDetails();

  // Create order
  const orderId = generateOrderId();
  const order = {
    orderId,
    items: cartDetails.items,
    summary: cartDetails.summary,
    orderDate: new Date().toISOString(),
    status: 'completed'
  };

  // Save order
  globalOrders.push(order);

  // Clear cart
  globalCart.items = [];

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        success: true,
        message: 'Order placed successfully!',
        order
      })
    }]
  };
}

// Get order summary
function handleGetOrderSummary(orderId) {
  if (!orderId) {
    throw { code: -32002, message: 'Order ID is required' };
  }

  const order = globalOrders.find(o => o.orderId === orderId);

  if (!order) {
    throw { code: -32008, message: `Order ${orderId} not found` };
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(order)
    }]
  };
}

/** -------- Shared MCP logic -------- */
function toolsDefinition() {
  return {
    tools: [
      {
        name: "search_products",
        title: "Search Grocery Products",
        description: "Search through a catalog of Indian grocery products including staples (rice, atta, dal), dairy products, beverages, spices, fresh produce, and household items. The search query will match against product titles, descriptions, and tags. Returns a list of matching products with their ID, title, and URL. Use this to discover products based on keywords like 'rice', 'dairy', 'spices', 'vegetables', brand names, or specific items like 'basmati', 'milk', 'turmeric'. The catalog contains 20 products across categories: Grocery > Staples, Grocery > Pulses, Grocery > Oils, Grocery > Dairy, Grocery > Beverages, Grocery > Snacks, Grocery > Breakfast, Grocery > Spices, Grocery > Produce, and Household.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query text to find products. Can be a product name (e.g., 'rice', 'milk'), category (e.g., 'dairy', 'spices'), brand name (e.g., 'SpiceWorks'), or tag (e.g., 'staples', 'healthy'). Search is case-insensitive and matches across product title, description text, and metadata tags."
            }
          },
          required: ["query"],
          additionalProperties: false
        }
      },
      {
        name: "get_product_details",
        title: "Get Product Details",
        description: "Retrieve complete information about a specific grocery product by its ID. Returns comprehensive product data including: product ID, title, full description text, product URL, and detailed metadata (brand, category, SKU, unit size, pricing in INR with MRP and discount percentage, stock availability, and tags). Use this after getting product IDs from the search_products tool to access detailed information including current price, discounts, and specifications. Product IDs follow the format 'prod-1' through 'prod-20'.",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Product ID to fetch (e.g., 'prod-1', 'prod-2', etc.). Must be a valid product ID from the catalog. Product IDs range from 'prod-1' to 'prod-20'. Use the search_products tool first to discover valid product IDs."
            }
          },
          required: ["id"],
          additionalProperties: false
        },
        outputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Unique product identifier" },
            title: { type: "string", description: "Product name and packaging size" },
            text: { type: "string", description: "Detailed product description including key features, price, and category" },
            url: { type: "string", description: "Product page URL" },
            metadata: {
              type: "object",
              description: "Structured product metadata including brand, category, SKU, unitSize, priceInINR, mrpInINR, discountPercent, inStock (boolean), and tags (array of strings)"
            }
          },
          required: ["id","title","text"],
          additionalProperties: true
        }
      },
      {
        name: "add_to_cart",
        title: "Add Product to Cart",
        description: "Add a grocery product to the shopping cart with specified quantity. Validates product availability and stock status. If the product is already in cart, this will ADD to the existing quantity (not replace). Returns confirmation message with updated cart summary including all items, quantities, and total amount. Use this after finding a product via search_products to add it to your cart.",
        inputSchema: {
          type: "object",
          properties: {
            productId: {
              type: "string",
              description: "Product ID to add to cart (e.g., 'prod-1', 'prod-2'). Use search_products to discover product IDs. The product must exist and be in stock."
            },
            quantity: {
              type: "integer",
              description: "Quantity to add to cart. Must be a positive integer. Defaults to 1 if not specified. This quantity will be added to any existing quantity in the cart.",
              default: 1,
              minimum: 1
            }
          },
          required: ["productId"],
          additionalProperties: false
        }
      },
      {
        name: "remove_from_cart",
        title: "Remove Product from Cart",
        description: "Remove a product completely from the shopping cart. This removes the entire product entry regardless of quantity. Returns confirmation message with updated cart summary. If you want to reduce quantity instead of removing completely, use remove_from_cart and then add_to_cart with the desired quantity.",
        inputSchema: {
          type: "object",
          properties: {
            productId: {
              type: "string",
              description: "Product ID to remove from cart (e.g., 'prod-1'). The product must exist in the cart."
            }
          },
          required: ["productId"],
          additionalProperties: false
        }
      },
      {
        name: "get_cart",
        title: "View Shopping Cart",
        description: "View the current shopping cart contents with full details. Returns all cart items with product information (title, quantity, unit price, unit MRP, line total, line savings), and a summary with subtotal, total MRP, total savings, final amount to pay, and item count. Use this to check what's in the cart before checkout or to show the user their current cart.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false
        }
      },
      {
        name: "clear_cart",
        title: "Clear Shopping Cart",
        description: "Empty the entire shopping cart, removing all items. This action removes all products from the cart regardless of quantity. Returns confirmation message with the number of items removed. Use this when the user wants to start over or cancel their shopping session.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false
        }
      },
      {
        name: "checkout",
        title: "Checkout and Place Order",
        description: "Process checkout and create a completed order from the current cart contents. Validates that cart is not empty. Returns order confirmation with unique order ID, itemized list of purchased products with quantities and prices, and order summary with total amount. The cart will be automatically cleared after successful checkout. Order status will be 'completed' and can be retrieved later using get_order_summary with the order ID.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false
        }
      },
      {
        name: "get_order_summary",
        title: "Get Order Summary",
        description: "Retrieve the details of a previously completed order by its order ID. Returns complete order information including order ID, all items purchased with quantities and prices, order summary with totals, order date/time, and order status. Use this to view past orders or to show order confirmation details after checkout. The order ID is provided when you complete checkout.",
        inputSchema: {
          type: "object",
          properties: {
            orderId: {
              type: "string",
              description: "Order ID to retrieve (e.g., 'order-1730028000-abc123def'). This ID is returned when you complete a checkout."
            }
          },
          required: ["orderId"],
          additionalProperties: false
        }
      }
    ]
  };
}

function handleToolsCall(params) {
  const { name, arguments: args } = params || {};
  if (name === 'search_products') {
    const q = (args?.query || '').toLowerCase();
    const results = products
      .filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.text.toLowerCase().includes(q) ||
        d.metadata.tags.some(t => t.toLowerCase().includes(q))
      )
      .map(d => ({ id: d.id, title: d.title, url: d.url }));

    return { content: [{ type: 'text', text: JSON.stringify({ results }) }] };
  }

  if (name === 'get_product_details') {
    const id = args?.id;
    const product = products.find(d => d.id === id);
    if (!product) {
      throw { code: -32004, message: `Product with id ${id} not found` };
    }
    return { content: [{ type: 'text', text: JSON.stringify(product) }] };
  }

  if (name === 'add_to_cart') {
    return handleAddToCart(args?.productId, args?.quantity || 1);
  }

  if (name === 'remove_from_cart') {
    return handleRemoveFromCart(args?.productId);
  }

  if (name === 'get_cart') {
    return handleGetCart();
  }

  if (name === 'clear_cart') {
    return handleClearCart();
  }

  if (name === 'checkout') {
    return handleCheckout();
  }

  if (name === 'get_order_summary') {
    return handleGetOrderSummary(args?.orderId);
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

      return res.json(jsonrpcOk(id, {
        protocolVersion,
        capabilities: {
          // Required shape: tools.listChanged boolean
          tools: { listChanged: false }
        },
        serverInfo: {
          name: 'AgenticPay MCP',
          title: 'Quick Commerce Demo Server',
          version: '1.0.0'
        },
        instructions: 'Use tools/list to see available shopping tools: search_products, add_to_cart, checkout, etc.'
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
          title: 'Quick Commerce Demo Server (Legacy)',
          version: '1.0.0'
        },
        instructions: 'Use tools/list to see available shopping tools.'
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
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`Health:        http://localhost:${PORT}/health`);
  console.log(`Capabilities:  http://localhost:${PORT}/capabilities`);
  console.log(`Modern MCP:    http://localhost:${PORT}/mcp (POST/GET)`);
  console.log(`Legacy SSE:    http://localhost:${PORT}/sse (GET + POST)`);
});

module.exports = app;
