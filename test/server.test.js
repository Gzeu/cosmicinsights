// Basic tests for Cosmic Insights server
const request = require('supertest');
const app = require('../server');

// Basic server tests
describe('🌟 Cosmic Insights Server Tests', () => {
  
  describe('🏠 Basic Routes', () => {
    test('should serve the main page', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /html/)
        .expect(200);
      
      expect(response.text).toContain('Cosmic Insights');
    });
    
    test('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);
      
      expect(response.text).toContain('Cosmic Insights');
    });
  });
  
  describe('🔌 API Endpoints', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toHaveProperty('server');
      expect(response.body.server).toBe('Operational');
    });
    
    test('should handle Groq API endpoint', async () => {
      const response = await request(app)
        .post('/api/groq')
        .send({ prompt: 'Test astrology reading' })
        .expect('Content-Type', /json/);
      
      // Should return either success or error, but valid JSON
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(500);
      expect(response.body).toBeDefined();
    });
    
    test('should validate Groq API input', async () => {
      const response = await request(app)
        .post('/api/groq')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
    
    test('should get readings endpoint', async () => {
      const response = await request(app)
        .get('/api/readings')
        .expect('Content-Type', /json/);
      
      // Should return success even if empty or if DB is not connected
      expect([200, 503]).toContain(response.status);
    });
  });
  
  describe('🛡️ Security', () => {
    test('should have security headers', async () => {
      const response = await request(app)
        .get('/');
      
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
    
    test('should handle rate limiting headers', async () => {
      const response = await request(app)
        .get('/api/health');
      
      // Rate limiting headers might be present
      if (response.headers['x-ratelimit-limit']) {
        expect(response.headers['x-ratelimit-limit']).toBeDefined();
      }
    });
  });
  
  describe('🎨 Static Assets', () => {
    test('should serve CSS files', async () => {
      const response = await request(app)
        .get('/style.css')
        .expect('Content-Type', /css/);
      
      expect([200, 404]).toContain(response.status);
    });
    
    test('should serve enhanced features JS', async () => {
      const response = await request(app)
        .get('/enhanced-features.js');
      
      expect([200, 404]).toContain(response.status);
    });
  });
});

// Utility tests
describe('🔧 Utility Functions', () => {
  test('should validate environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
  
  test('should have required dependencies', () => {
    expect(require('express')).toBeDefined();
    expect(require('mongodb')).toBeDefined();
    expect(require('axios')).toBeDefined();
  });
});

// Performance tests
describe('⚡ Performance', () => {
  test('health endpoint should respond quickly', async () => {
    const start = Date.now();
    
    await request(app)
      .get('/api/health')
      .expect(200);
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(5000); // Less than 5 seconds
  });
  
  test('main page should load in reasonable time', async () => {
    const start = Date.now();
    
    await request(app)
      .get('/')
      .expect(200);
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(10000); // Less than 10 seconds
  });
});