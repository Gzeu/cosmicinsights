const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const { MongoClient } = require('mongodb');
const rateLimit = require('express-rate-limit');

// Load environment variables from .env file
dotenv.config();

// Debug: Log environment variables to verify
console.log('Environment Variables:', {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI
});

// Validate required environment variables
if (!process.env.MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in the .env file.');
    process.exit(1);
}

if (!process.env.GROQ_API_KEY) {
    console.error('Error: GROQ_API_KEY is not defined in the .env file.');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB setup
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        db = client.db('cosmicinsights');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
}

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (your frontend)
app.use(express.static(path.join(__dirname, '.')));

// Rate limiting middleware
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
});

app.use('/api', apiLimiter);

// Function to make a request to Groq API with retry logic
async function makeGroqRequest(data, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', data, {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            if (error.response && error.response.status === 429) {
                console.log(`Rate limit hit, retrying in ${delay}ms... (${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            } else {
                throw error;
            }
        }
    }
}

// Proxy endpoint to handle Groq API requests and store results in MongoDB
app.post('/api/groq', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await makeGroqRequest({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: 'You are a helpful AI assistant specializing in astrology, numerology, tarot, and dream interpretation.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 500
        });

        const aiResponse = response.data.choices[0].message.content || 'No response received from AI.';

        // Store the prompt and response in MongoDB
        const readingsCollection = db.collection('readings');
        await readingsCollection.insertOne({
            prompt: prompt,
            response: aiResponse,
            timestamp: new Date()
        });

        res.json({ text: aiResponse });
    } catch (error) {
        console.error('Error fetching Groq AI response:', {
            message: error.message,
            status: error.response ? error.response.status : 'N/A',
            data: error.response ? error.response.data : 'N/A',
            config: error.config ? error.config.url : 'N/A'
        });
        res.status(500).json({
            error: 'Failed to fetch response from Groq AI',
            details: error.message,
            status: error.response ? error.response.status : 'Unknown'
        });
    }
});

// Endpoint to retrieve past readings
app.get('/api/readings', async (req, res) => {
    try {
        const readingsCollection = db.collection('readings');
        const readings = await readingsCollection.find().sort({ timestamp: -1 }).limit(10).toArray();
        res.json(readings);
    } catch (error) {
        console.error('Error fetching past readings:', error.message);
        res.status(500).json({ error: 'Failed to fetch past readings', details: error.message });
    }
});

// Start the server and connect to MongoDB
async function startServer() {
    await connectToMongoDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();

// Gracefully close MongoDB connection on server shutdown
process.on('SIGINT', async () => {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});