const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const { MongoClient } = require('mongodb');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in environment variables.');
    process.exit(1);
}

if (!process.env.GROQ_API_KEY) {
    console.error('Error: GROQ_API_KEY is not defined in environment variables.');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB setup
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
});
let db;
let isConnected = false;

// Connect to MongoDB with retry logic
async function connectToMongoDB() {
    let retries = 3;
    while (retries > 0) {
        try {
            await client.connect();
            await client.db('admin').command({ ping: 1 });
            console.log('✅ Successfully connected to MongoDB Atlas');
            db = client.db('cosmicinsights');
            isConnected = true;
            
            // Create indexes for better performance
            try {
                await db.collection('readings').createIndex({ timestamp: -1 });
            } catch (indexError) {
                console.warn('Could not create indexes:', indexError.message);
            }
            
            return;
        } catch (error) {
            retries--;
            console.error(`MongoDB connection failed. Retries left: ${retries}`, error.message);
            if (retries === 0) {
                console.error('Failed to connect to MongoDB after multiple attempts');
                // Don't exit - allow app to run without database
                isConnected = false;
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://cdnjs.cloudflare.com'],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com'],
            fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"]
        }
    }
}));

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://cosmicinsights.vercel.app', 'https://cosmicinsights-git-main-gzeus-projects.vercel.app']
        : true,
    credentials: true
}));

// Compression middleware
app.use(compression());

// Request parsing middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, '.'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0',
    etag: true
}));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requests per window
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api', apiLimiter);

// Enhanced Groq API request function
async function makeGroqRequest(data, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', data, {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'CosmicInsights/2.0'
                },
                timeout: 30000
            });
            return response;
        } catch (error) {
            console.warn(`Groq API attempt ${i + 1}/${retries} failed:`, error.response?.status || error.message);
            
            if (i === retries - 1) throw error;
            
            if (error.response?.status === 429) {
                console.log(`Rate limit hit, retrying in ${delay}ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            } else if (error.response?.status >= 500) {
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
    const healthCheck = {
        server: 'Operational',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV || 'development'
    };

    try {
        // Check MongoDB connection
        if (isConnected && db) {
            await client.db('admin').command({ ping: 1 });
            healthCheck.mongodb = 'Operational';
        } else {
            healthCheck.mongodb = 'Disconnected';
        }

        // Check Groq API
        try {
            await axios.get('https://api.groq.com/openai/v1/models', {
                headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
                timeout: 5000
            });
            healthCheck.groqApi = 'Operational';
        } catch (apiError) {
            console.warn('Groq API health check failed:', apiError.message);
            healthCheck.groqApi = 'Unavailable';
        }

        healthCheck.rateLimiter = 'Operational';
        
        const isHealthy = healthCheck.mongodb === 'Operational' && healthCheck.groqApi === 'Operational';
        res.status(isHealthy ? 200 : 503).json(healthCheck);
        
    } catch (error) {
        console.error('Health check failed:', error.message);
        res.status(503).json({
            ...healthCheck,
            status: 'Unhealthy',
            error: error.message
        });
    }
});

// Groq proxy endpoint with basic validation
app.post('/api/groq', async (req, res) => {
    const { prompt } = req.body;

    // Basic validation
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Valid prompt is required' });
    }
    
    if (prompt.length < 10 || prompt.length > 2000) {
        return res.status(400).json({ error: 'Prompt must be between 10 and 2000 characters' });
    }

    const requestId = Math.random().toString(36).substring(7);
    
    console.log(`🔮 Processing request ${requestId} - Prompt length: ${prompt.length}`);

    try {
        const requestData = {
            model: 'llama-3.3-70b-versatile',
            messages: [
                { 
                    role: 'system', 
                    content: 'You are a compassionate and insightful spiritual advisor specializing in astrology, numerology, tarot, and dream interpretation. Provide detailed, personalized readings that are both informative and emotionally supportive. Always maintain a respectful and mystical tone while being helpful and authentic.' 
                },
                { role: 'user', content: prompt }
            ],
            max_tokens: 1000,
            temperature: 0.7,
            top_p: 0.9
        };

        const response = await makeGroqRequest(requestData);
        const aiResponse = response.data.choices[0].message.content || 'No response received from AI.';

        // Store reading in database if connected
        if (isConnected && db) {
            try {
                await db.collection('readings').insertOne({
                    requestId,
                    prompt: prompt.substring(0, 200), // Store truncated for privacy
                    response: aiResponse,
                    timestamp: new Date(),
                    metadata: {
                        model: 'llama-3.3-70b-versatile',
                        responseLength: aiResponse.length
                    }
                });
                console.log(`✅ Reading ${requestId} stored successfully`);
            } catch (dbError) {
                console.warn('Failed to store reading:', dbError.message);
            }
        }

        res.json({ 
            text: aiResponse,
            requestId,
            timestamp: new Date().toISOString()
        });
        
        console.log(`✅ Request ${requestId} completed successfully`);
        
    } catch (error) {
        console.error(`❌ Request ${requestId} failed:`, error.message);
        
        const statusCode = error.response?.status === 429 ? 429 : 
                          error.response?.status >= 500 ? 502 : 500;
                          
        res.status(statusCode).json({
            error: 'Failed to generate reading',
            requestId,
            details: error.response?.status === 429 ? 'Rate limit exceeded, please try again later' : 
                     process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
            retryAfter: error.response?.status === 429 ? 60 : undefined
        });
    }
});

// Enhanced readings endpoint
app.get('/api/readings', async (req, res) => {
    try {
        if (!isConnected || !db) {
            return res.status(503).json({ 
                error: 'Database unavailable',
                readings: [] // Return empty array for frontend compatibility
            });
        }
        
        const limit = Math.min(parseInt(req.query.limit) || 10, 20);
        const skip = Math.max(parseInt(req.query.skip) || 0, 0);
        
        const readings = await db.collection('readings')
            .find({}, { 
                projection: { 
                    response: 1, 
                    timestamp: 1,
                    requestId: 1
                } 
            })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
            
        const total = await db.collection('readings').countDocuments();
        
        res.json({
            readings,
            pagination: {
                total,
                limit,
                skip,
                hasMore: (skip + limit) < total
            }
        });
        
    } catch (error) {
        console.error('Error fetching readings:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch readings',
            readings: []
        });
    }
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 handler
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: 'API endpoint not found' });
    } else {
        res.status(404).sendFile(path.join(__dirname, 'index.html')); // SPA fallback
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error.message);
    res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// Server startup
async function startServer() {
    try {
        await connectToMongoDB();
        
        app.listen(PORT, () => {
            console.log(`🌟 Cosmic Insights server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 MongoDB: ${isConnected ? 'Connected' : 'Disconnected'}`);
        });
        
    } catch (error) {
        console.error('Failed to start server:', error.message);
        // Try to start without database connection
        app.listen(PORT, () => {
            console.log(`🌟 Cosmic Insights server running on port ${PORT} (without database)`);
        });
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🔄 Shutting down gracefully...');
    try {
        if (isConnected) {
            await client.close();
            console.log('✅ MongoDB connection closed');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error.message);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    console.log('🔄 Received SIGTERM, shutting down gracefully...');
    if (isConnected) {
        await client.close();
    }
    process.exit(0);
});

startServer();

module.exports = app;