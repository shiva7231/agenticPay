const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Dummy data for testing
const dummyDocuments = [
    {
        id: "doc-1",
        title: "Complete Guide to Node.js Development",
        text: "Node.js is a powerful JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to build scalable network applications using JavaScript on the server side. Key features include event-driven architecture, non-blocking I/O operations, and a rich ecosystem through npm. Popular frameworks include Express.js for web applications, Socket.io for real-time communication, and many others. Node.js is widely used for building APIs, microservices, and full-stack applications.",
        url: "https://example.com/nodejs-guide",
        metadata: {
            author: "Tech Expert",
            category: "Programming",
            tags: ["javascript", "backend", "server"]
        }
    },
    {
        id: "doc-2", 
        title: "Understanding RESTful APIs",
        text: "REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use standard HTTP methods like GET, POST, PUT, DELETE to perform operations on resources. Key principles include statelessness, uniform interface, cacheable responses, and layered system architecture. Best practices include proper status codes, consistent naming conventions, versioning, and comprehensive documentation. RESTful APIs are essential for modern web development and microservices architecture.",
        url: "https://example.com/rest-api-guide",
        metadata: {
            author: "API Designer",
            category: "Web Development", 
            tags: ["api", "rest", "http"]
        }
    },
    {
        id: "doc-3",
        title: "Database Design Fundamentals",
        text: "Database design is crucial for application performance and scalability. Key concepts include normalization to reduce redundancy, proper indexing for query optimization, and choosing appropriate data types. Relational databases like PostgreSQL and MySQL follow ACID properties, while NoSQL databases like MongoDB offer flexibility for unstructured data. Consider factors like consistency requirements, scalability needs, and query patterns when choosing a database solution.",
        url: "https://example.com/database-design",
        metadata: {
            author: "Database Expert",
            category: "Database",
            tags: ["sql", "nosql", "design"]
        }
    },
    {
        id: "doc-4",
        title: "Modern JavaScript ES6+ Features",
        text: "ES6 introduced many powerful features to JavaScript including arrow functions, template literals, destructuring assignment, and promises. ES2017 added async/await for better asynchronous programming. Other important features include modules for better code organization, classes for object-oriented programming, and new data structures like Map and Set. These features make JavaScript more powerful and developer-friendly for modern application development.",
        url: "https://example.com/javascript-es6",
        metadata: {
            author: "JS Developer",
            category: "Programming",
            tags: ["javascript", "es6", "modern"]
        }
    },
    {
        id: "doc-5",
        title: "Cloud Computing Basics", 
        text: "Cloud computing provides on-demand access to computing resources over the internet. Main service models include IaaS (Infrastructure as a Service), PaaS (Platform as a Service), and SaaS (Software as a Service). Major providers like AWS, Azure, and Google Cloud offer various services including virtual machines, databases, storage, and serverless computing. Benefits include scalability, cost-effectiveness, and reduced infrastructure management overhead.",
        url: "https://example.com/cloud-computing",
        metadata: {
            author: "Cloud Architect",
            category: "Cloud Technology",
            tags: ["cloud", "aws", "azure"]
        }
    }
];

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// MCP Server Capabilities endpoint
app.get('/capabilities', (req, res) => {
    res.json({
        capabilities: {
            tools: [
                {
                    name: "search",
                    description: "Search through documents using a query string"
                },
                {
                    name: "fetch", 
                    description: "Fetch full content of a document by ID"
                }
            ]
        }
    });
});

// SSE endpoint for MCP communication
app.get('/sse', (req, res) => {
    // Set headers for SSE
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Send initial connection message
    res.write('data: {"type":"connection","status":"connected"}\n\n');

    // Send server capabilities
    setTimeout(() => {
        const capabilities = {
            type: "capabilities",
            capabilities: {
                tools: [
                    {
                        name: "search",
                        description: "Search through documents using a query string",
                        inputSchema: {
                            type: "object",
                            properties: {
                                query: {
                                    type: "string",
                                    description: "Search query"
                                }
                            },
                            required: ["query"]
                        }
                    },
                    {
                        name: "fetch",
                        description: "Fetch full content of a document by ID",
                        inputSchema: {
                            type: "object", 
                            properties: {
                                id: {
                                    type: "string",
                                    description: "Document ID"
                                }
                            },
                            required: ["id"]
                        }
                    }
                ]
            }
        };
        res.write('data: ' + JSON.stringify(capabilities) + '\n\n');
    }, 1000);

    // Keep connection alive with heartbeat
    const heartbeat = setInterval(() => {
        res.write('data: {"type":"heartbeat","timestamp":"' + new Date().toISOString() + '"}\n\n');
    }, 30000);

    // Clean up on client disconnect
    req.on('close', () => {
        clearInterval(heartbeat);
    });
});

// POST endpoint for SSE-based MCP requests
app.post('/sse', async (req, res) => {
    try {
        console.log('SSE POST request received:', JSON.stringify(req.body, null, 2));
        
        // Set SSE headers
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control, Content-Type'
        });

        const { method, params } = req.body;
        
        if (method === 'tools/call') {
            const { name, arguments: args } = params;
            
            if (name === 'search') {
                const query = args.query.toLowerCase();
                console.log('SSE Search query:', query);
                
                const results = dummyDocuments.filter(doc => 
                    doc.title.toLowerCase().includes(query) ||
                    doc.text.toLowerCase().includes(query) ||
                    doc.metadata.tags.some(tag => tag.toLowerCase().includes(query))
                ).map(doc => ({
                    id: doc.id,
                    title: doc.title,
                    url: doc.url
                }));

                const response = {
                    type: "tool_result",
                    content: [{
                        type: "text",
                        text: JSON.stringify({ results })
                    }]
                };
                
                res.write('data: ' + JSON.stringify(response) + '\n\n');
                
            } else if (name === 'fetch') {
                const docId = args.id;
                console.log('SSE Fetch document:', docId);
                
                const document = dummyDocuments.find(doc => doc.id === docId);
                
                if (!document) {
                    const errorResponse = {
                        type: "error",
                        error: { message: `Document with id ${docId} not found` }
                    };
                    res.write('data: ' + JSON.stringify(errorResponse) + '\n\n');
                    res.end();
                    return;
                }

                const response = {
                    type: "tool_result",
                    content: [{
                        type: "text", 
                        text: JSON.stringify({
                            id: document.id,
                            title: document.title,
                            text: document.text,
                            url: document.url,
                            metadata: document.metadata
                        })
                    }]
                };
                
                res.write('data: ' + JSON.stringify(response) + '\n\n');
            }
        }
        
        res.end();
        
    } catch (error) {
        console.error('SSE POST Error:', error);
        const errorResponse = {
            type: "error", 
            error: { message: 'Internal server error' }
        };
        res.write('data: ' + JSON.stringify(errorResponse) + '\n\n');
        res.end();
    }
});

// Main MCP endpoint for tool calls
app.post('/mcp', async (req, res) => {
    try {
        const { method, params } = req.body;
        
        console.log('Received MCP request:', { method, params });

        if (method === 'tools/call') {
            const { name, arguments: args } = params;
            
            if (name === 'search') {
                const query = args.query.toLowerCase();
                console.log('Search query:', query);
                
                // Search through documents
                const results = dummyDocuments.filter(doc => 
                    doc.title.toLowerCase().includes(query) ||
                    doc.text.toLowerCase().includes(query) ||
                    doc.metadata.tags.some(tag => tag.toLowerCase().includes(query))
                ).map(doc => ({
                    id: doc.id,
                    title: doc.title,
                    url: doc.url
                }));

                const response = {
                    content: [{
                        type: "text",
                        text: JSON.stringify({ results })
                    }]
                };
                
                console.log('Search results:', results.length);
                res.json(response);
                
            } else if (name === 'fetch') {
                const docId = args.id;
                console.log('Fetch document:', docId);
                
                const document = dummyDocuments.find(doc => doc.id === docId);
                
                if (!document) {
                    return res.status(404).json({
                        error: { message: `Document with id ${docId} not found` }
                    });
                }

                const response = {
                    content: [{
                        type: "text", 
                        text: JSON.stringify({
                            id: document.id,
                            title: document.title,
                            text: document.text,
                            url: document.url,
                            metadata: document.metadata
                        })
                    }]
                };
                
                console.log('Fetched document:', document.title);
                res.json(response);
                
            } else {
                res.status(400).json({
                    error: { message: `Unknown tool: ${name}` }
                });
            }
        } else {
            res.status(400).json({
                error: { message: `Unknown method: ${method}` }
            });
        }
    } catch (error) {
        console.error('Error processing MCP request:', error);
        res.status(500).json({
            error: { message: 'Internal server error' }
        });
    }
});

// Handle preflight requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`MCP Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
    console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
});

module.exports = app;
