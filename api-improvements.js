// API and Backend Improvements for Cosmic Insights
// Enhanced error handling, caching, rate limiting, and new endpoints

const express = require('express');
const NodeCache = require('node-cache');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');

// Initialize cache with 10 minutes TTL
const cache = new NodeCache({ stdTTL: 600 });

class APIEnhancements {
    constructor(app, db) {
        this.app = app;
        this.db = db;
        this.setupAdvancedRateLimit();
        this.setupValidation();
        this.setupCaching();
        this.setupNewEndpoints();
        this.setupAnalytics();
        this.setupWebhooks();
    }

    // Advanced rate limiting with different tiers
    setupAdvancedRateLimit() {
        // Premium users get higher limits
        const premiumLimiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // 100 requests per window
            skip: (req) => req.headers['x-premium-user'] === 'true',
            message: {
                error: 'Too many requests. Upgrade to premium for higher limits.',
                upgradeUrl: '/premium'
            }
        });

        // Enhanced endpoint for premium features
        this.app.use('/api/premium', premiumLimiter);

        // Adaptive rate limiting based on server load
        const adaptiveLimiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: (req) => {
                const serverLoad = process.cpuUsage();
                const baseLimit = 50;
                const loadFactor = Math.max(0.1, 1 - (serverLoad.user / 1000000)); // Adjust based on CPU usage
                return Math.floor(baseLimit * loadFactor);
            },
            message: {
                error: 'Server is experiencing high load. Please try again later.',
                retryAfter: 60
            }
        });

        this.app.use('/api/adaptive', adaptiveLimiter);
    }

    // Input validation and sanitization
    setupValidation() {
        // Validation middleware for readings
        const validateReading = [
            body('prompt')
                .isLength({ min: 10, max: 2000 })
                .escape()
                .withMessage('Prompt must be between 10 and 2000 characters'),
            body('type')
                .optional()
                .isIn(['astrology', 'numerology', 'tarot', 'dream'])
                .withMessage('Invalid reading type'),
            body('email')
                .optional()
                .isEmail()
                .normalizeEmail()
                .withMessage('Invalid email format')
        ];

        // Enhanced Groq endpoint with validation
        this.app.post('/api/groq/validated', validateReading, async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        error: 'Validation failed',
                        details: errors.array()
                    });
                }

                const { prompt, type, email } = req.body;
                const requestId = crypto.randomUUID();
                
                // Check cache first
                const cacheKey = crypto.createHash('md5').update(prompt).digest('hex');
                const cachedResult = cache.get(cacheKey);
                
                if (cachedResult) {
                    return res.json({
                        ...cachedResult,
                        cached: true,
                        requestId
                    });
                }

                // Process the request (integrate with existing Groq logic)
                const result = await this.processReadingRequest(prompt, type, requestId);
                
                // Cache the result
                cache.set(cacheKey, result);
                
                // Save to database with additional metadata
                if (this.db) {
                    await this.db.collection('readings').insertOne({
                        requestId,
                        prompt: prompt.substring(0, 200),
                        type,
                        email,
                        response: result.text,
                        cached: false,
                        timestamp: new Date(),
                        metadata: {
                            ip: req.ip,
                            userAgent: req.headers['user-agent'],
                            responseTime: Date.now() - req.startTime
                        }
                    });
                }

                res.json({ ...result, requestId });
                
            } catch (error) {
                console.error('Validated endpoint error:', error);
                res.status(500).json({
                    error: 'Processing failed',
                    requestId: crypto.randomUUID(),
                    message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
                });
            }
        });
    }

    // Caching layer for frequently requested content
    setupCaching() {
        // Cache middleware
        const cacheMiddleware = (duration = 300) => {
            return (req, res, next) => {
                if (req.method !== 'GET') return next();
                
                const key = req.originalUrl;
                const cachedResponse = cache.get(key);
                
                if (cachedResponse) {
                    return res.json({
                        ...cachedResponse,
                        cached: true,
                        timestamp: new Date()
                    });
                }
                
                // Override res.json to cache the response
                const originalJson = res.json;
                res.json = function(data) {
                    cache.set(key, data, duration);
                    originalJson.call(this, { ...data, cached: false });
                };
                
                next();
            };
        };

        // Cached endpoints
        this.app.get('/api/popular-readings', cacheMiddleware(3600), async (req, res) => {
            try {
                const popularReadings = await this.db.collection('readings')
                    .aggregate([
                        { $group: { _id: '$type', count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 10 }
                    ])
                    .toArray();
                    
                res.json({ popularReadings });
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch popular readings' });
            }
        });

        this.app.get('/api/stats', cacheMiddleware(1800), async (req, res) => {
            try {
                const stats = await this.db.collection('readings')
                    .aggregate([
                        {
                            $group: {
                                _id: null,
                                totalReadings: { $sum: 1 },
                                avgResponseTime: { $avg: '$metadata.responseTime' },
                                readingTypes: { $addToSet: '$type' }
                            }
                        }
                    ])
                    .toArray();
                    
                res.json({ stats: stats[0] || {} });
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch stats' });
            }
        });
    }

    // New endpoints for enhanced functionality
    setupNewEndpoints() {
        // Batch reading endpoint
        this.app.post('/api/batch-readings', async (req, res) => {
            try {
                const { readings } = req.body;
                
                if (!Array.isArray(readings) || readings.length > 5) {
                    return res.status(400).json({
                        error: 'Invalid batch request. Maximum 5 readings per batch.'
                    });
                }

                const results = await Promise.all(
                    readings.map(async (reading, index) => {
                        try {
                            const result = await this.processReadingRequest(
                                reading.prompt,
                                reading.type,
                                `batch-${crypto.randomUUID()}-${index}`
                            );
                            return { success: true, ...result };
                        } catch (error) {
                            return { 
                                success: false, 
                                error: error.message,
                                index 
                            };
                        }
                    })
                );

                res.json({ batchResults: results });
                
            } catch (error) {
                res.status(500).json({ error: 'Batch processing failed' });
            }
        });

        // Personalized recommendations
        this.app.get('/api/recommendations/:userId', async (req, res) => {
            try {
                const { userId } = req.params;
                
                // Get user's reading history
                const userReadings = await this.db.collection('readings')
                    .find({ userId })
                    .sort({ timestamp: -1 })
                    .limit(10)
                    .toArray();

                // Generate recommendations based on history
                const recommendations = this.generateRecommendations(userReadings);
                
                res.json({ recommendations });
                
            } catch (error) {
                res.status(500).json({ error: 'Failed to generate recommendations' });
            }
        });

        // Reading templates
        this.app.get('/api/templates/:type', async (req, res) => {
            try {
                const { type } = req.params;
                
                const templates = {
                    astrology: [
                        "What does my birth chart reveal about my career path?",
                        "How do current planetary transits affect my relationships?",
                        "What are my strongest astrological aspects?"
                    ],
                    numerology: [
                        "What does my life path number mean for my future?",
                        "How can I use my destiny number for success?",
                        "What is my personal year number telling me?"
                    ],
                    tarot: [
                        "What do I need to know about my current situation?",
                        "What obstacles am I facing and how can I overcome them?",
                        "What opportunities are coming my way?"
                    ],
                    dream: [
                        "What does my recurring dream about water mean?",
                        "Why do I keep dreaming about my childhood home?",
                        "What is my subconscious trying to tell me?"
                    ]
                };
                
                res.json({ templates: templates[type] || [] });
                
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch templates' });
            }
        });
    }

    // Analytics and monitoring
    setupAnalytics() {
        // Request timing middleware
        this.app.use((req, res, next) => {
            req.startTime = Date.now();
            next();
        });

        // Analytics endpoint
        this.app.get('/api/analytics', async (req, res) => {
            try {
                const { startDate, endDate } = req.query;
                
                const pipeline = [
                    {
                        $match: {
                            timestamp: {
                                $gte: new Date(startDate || Date.now() - 7 * 24 * 60 * 60 * 1000),
                                $lte: new Date(endDate || Date.now())
                            }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                                type: "$type"
                            },
                            count: { $sum: 1 },
                            avgResponseTime: { $avg: "$metadata.responseTime" }
                        }
                    },
                    { $sort: { "_id.date": 1 } }
                ];
                
                const analytics = await this.db.collection('readings').aggregate(pipeline).toArray();
                
                res.json({ analytics });
                
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch analytics' });
            }
        });
    }

    // Webhook system for integrations
    setupWebhooks() {
        this.app.post('/api/webhooks/reading-complete', async (req, res) => {
            try {
                const { readingId, webhook_url } = req.body;
                
                if (webhook_url) {
                    // Send webhook notification
                    const reading = await this.db.collection('readings').findOne({ requestId: readingId });
                    
                    if (reading) {
                        await this.sendWebhook(webhook_url, {
                            event: 'reading_complete',
                            data: {
                                readingId: reading.requestId,
                                type: reading.type,
                                timestamp: reading.timestamp
                            }
                        });
                    }
                }
                
                res.json({ success: true });
                
            } catch (error) {
                res.status(500).json({ error: 'Webhook processing failed' });
            }
        });
    }

    // Helper methods
    async processReadingRequest(prompt, type, requestId) {
        // This would integrate with your existing Groq API logic
        // Placeholder for the actual implementation
        return {
            text: "Enhanced reading response would go here",
            requestId,
            type,
            timestamp: new Date().toISOString()
        };
    }

    generateRecommendations(userReadings) {
        // Simple recommendation algorithm
        const typeCounts = userReadings.reduce((acc, reading) => {
            acc[reading.type] = (acc[reading.type] || 0) + 1;
            return acc;
        }, {});

        const mostUsedType = Object.keys(typeCounts).reduce((a, b) => 
            typeCounts[a] > typeCounts[b] ? a : b, 'astrology');

        const recommendations = {
            astrology: ["Try a numerology reading to complement your astrological insights"],
            numerology: ["Explore tarot for guidance on your numerological path"],
            tarot: ["Consider dream interpretation to understand your subconscious messages"],
            dream: ["An astrology reading might reveal cosmic influences on your dreams"]
        };

        return recommendations[mostUsedType] || recommendations.astrology;
    }

    async sendWebhook(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'CosmicInsights-Webhook/1.0'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`Webhook failed: ${response.status}`);
            }
            
        } catch (error) {
            console.error('Webhook send failed:', error);
        }
    }
}

// Export the class
module.exports = APIEnhancements;

// Usage example:
// const apiEnhancements = new APIEnhancements(app, db);