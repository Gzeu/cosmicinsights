const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const { MongoClient } = require('mongodb');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const winston = require('winston');
const { body, validationResult } = require('express-validator');

// Load environment variables
dotenv.config();

// Configure Winston logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'cosmicinsights' },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// Only add file transports in non-serverless environments
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    logger.add(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
    logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
}

// Validate required environment variables
if (!process.env.MONGODB_URI) {
    logger.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

if (!process.env.GROQ_API_KEY) {
    logger.error('GROQ_API_KEY is not defined in environment variables');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB setup with enhanced configuration
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
    let retries = 5;
    while (retries > 0) {
        try {
            await client.connect();
            await client.db('admin').command({ ping: 1 });
            logger.info('Successfully connected to MongoDB Atlas');
            db = client.db('cosmicinsights');
            isConnected = true;
            
            // Create indexes for better performance
            try {
                await db.collection('readings').createIndex({ timestamp: -1 });
                await db.collection('readings').createIndex({ 'metadata.userId': 1 });
            } catch (indexError) {
                logger.warn('Could not create indexes', indexError.message);
            }
            
            return;
        } catch (error) {
            retries--;
            logger.error(`MongoDB connection failed. Retries left: ${retries}`, error.message);
            if (retries === 0) {
                logger.error('Failed to connect to MongoDB after multiple attempts');
                process.exit(1);
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
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
        ? ['https://cosmicinsights.vercel.app', 'https://cosmicinsights-gzeu.vercel.app']
        : true,
    credentials: true
}));

// Compression middleware
app.use(compression());

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    req.startTime = Date.now();
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')?.substring(0, 100)
    });
    next();
});

// Serve static files with caching
app.use(express.static(path.join(__dirname, '.'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0',
    etag: true
}));

// Rate limiting configuration
const createRateLimit = (windowMs, max, message) => rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ error: message });
    }
});

// Apply different rate limits
const generalLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    100, // 100 requests per window
    'Too many requests from this IP, please try again after 15 minutes'
);

const apiLimiter = createRateLimit(
    5 * 60 * 1000, // 5 minutes
    10, // 10 API calls per window
    'Too many API requests from this IP, please try again after 5 minutes'
);

// Speed limiting for API calls
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 3, // Allow 3 requests per windowMs without delay
    delayMs: 500 // Add 500ms delay per request after delayAfter
});

app.use(generalLimiter);
app.use('/api', apiLimiter, speedLimiter);

// Input validation middleware
const validatePrompt = [
    body('prompt')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Prompt must be between 10 and 2000 characters')
        .escape()
];

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
                timeout: 30000 // 30 second timeout
            });
            return response;
        } catch (error) {
            logger.warn(`Groq API attempt ${i + 1}/${retries} failed`, {
                status: error.response?.status,
                message: error.message
            });
            
            if (i === retries - 1) throw error;
            
            if (error.response?.status === 429) {
                logger.info(`Rate limit hit, retrying in ${delay}ms`);
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
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    };

    try {
        // Check MongoDB connection
        if (isConnected) {
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
        } catch {
            healthCheck.groqApi = 'Unavailable';
        }

        healthCheck.rateLimiter = 'Operational';
        
        const isHealthy = Object.values(healthCheck)
            .filter(v => typeof v === 'string')
            .every(v => v === 'Operational');
            
        res.status(isHealthy ? 200 : 503).json(healthCheck);
    } catch (error) {
        logger.error('Health check failed', error);
        res.status(503).json({
            ...healthCheck,
            status: 'Unhealthy',
            error: error.message
        });
    }
});

// Enhanced Groq proxy endpoint
app.post('/api/groq', validatePrompt, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Validation failed for /api/groq', { errors: errors.array() });
        return res.status(400).json({ 
            error: 'Invalid input', 
            details: errors.array() 
        });
    }

    const { prompt } = req.body;
    const requestId = Math.random().toString(36).substring(7);
    
    logger.info(`Processing Groq request ${requestId}`, {
        promptLength: prompt.length,
        ip: req.ip
    });

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
            max_tokens: 800,
            temperature: 0.7,
            top_p: 0.9
        };

        const response = await makeGroqRequest(requestData);
        const aiResponse = response.data.choices[0].message.content || 'No response received from AI.';

        // Enhanced reading storage with metadata
        if (isConnected && db) {
            try {
                const readingDocument = {
                    requestId,
                    prompt: prompt.substring(0, 500), // Store truncated version for privacy
                    response: aiResponse,
                    timestamp: new Date(),
                    metadata: {
                        model: 'llama-3.3-70b-versatile',
                        ipHash: require('crypto').createHash('sha256').update(req.ip || '').digest('hex').substring(0, 8),
                        userAgent: req.get('User-Agent')?.substring(0, 100),
                        responseLength: aiResponse.length,
                        processingTime: Date.now() - req.startTime
                    }
                };
                
                await db.collection('readings').insertOne(readingDocument);
                logger.info(`Reading ${requestId} stored successfully`);
            } catch (dbError) {
                logger.warn('Failed to store reading in database', dbError.message);
            }
        }

        res.json({ 
            text: aiResponse,
            requestId,
            timestamp: new Date().toISOString()
        });
        
        logger.info(`Request ${requestId} completed successfully`);
        
    } catch (error) {
        logger.error(`Request ${requestId} failed`, {
            message: error.message,
            status: error.response?.status
        });
        
        const statusCode = error.response?.status === 429 ? 429 : 
                          error.response?.status >= 500 ? 502 : 500;
                          
        res.status(statusCode).json({
            error: 'Failed to generate reading',
            requestId,
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
            retryAfter: error.response?.status === 429 ? 60 : undefined
        });
    }
});

// Enhanced readings endpoint with pagination
app.get('/api/readings', async (req, res) => {
    try {
        if (!isConnected || !db) {
            return res.status(503).json({ error: 'Database unavailable' });
        }
        
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const skip = parseInt(req.query.skip) || 0;
        
        const readings = await db.collection('readings')
            .find({}, { 
                projection: { 
                    prompt: { $substr: ['$prompt', 0, 100] }, // Truncate for privacy
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
        logger.error('Error fetching readings', error);
        res.status(500).json({ 
            error: 'Failed to fetch readings', 
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Analytics endpoint (basic)
app.get('/api/analytics', async (req, res) => {
    try {
        if (!isConnected || !db) {
            return res.status(503).json({ error: 'Database unavailable' });
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const [totalReadings, todayReadings, avgResponseLength] = await Promise.all([
            db.collection('readings').countDocuments(),
            db.collection('readings').countDocuments({ timestamp: { $gte: today } }),
            db.collection('readings').aggregate([
                { $group: { _id: null, avgLength: { $avg: '$metadata.responseLength' } } }
            ]).toArray()
        ]);
        
        res.json({
            totalReadings,
            todayReadings,
            averageResponseLength: Math.round(avgResponseLength[0]?.avgLength || 0),
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        logger.error('Error fetching analytics', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    logger.error('Unhandled error', error);
    res.status(500).json({
        error: 'Internal server error',
        requestId: Math.random().toString(36).substring(7)
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Server startup
async function startServer() {
    try {
        await connectToMongoDB();
        
        app.listen(PORT, () => {
            logger.info(`🌟 Cosmic Insights server running on port ${PORT}`, {
                environment: process.env.NODE_ENV || 'development',
                nodeVersion: process.version
            });
        });
        
    } catch (error) {
        logger.error('Failed to start server', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    logger.info('Received SIGINT, shutting down gracefully');
    
    try {
        if (isConnected) {
            await client.close();
            logger.info('MongoDB connection closed');
        }
        process.exit(0);
    } catch (error) {
        logger.error('Error during shutdown', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM, shutting down gracefully');
    if (isConnected) {
        await client.close();
    }
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at Promise', { reason });
    process.exit(1);
});

startServer();

module.exports = app;