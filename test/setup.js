// Test setup file for Cosmic Insights
// This file runs before all tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/cosmicinsights-test';
process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || 'test-groq-key';

// Global test timeout
jest.setTimeout(30000);

// Mock console.log in tests to reduce noise
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: console.error // Keep errors visible
  };
}

// Global test utilities
global.testUtils = {
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  mockResponse: () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  })
};

// Clean up after tests
aftereachAll(async () => {
  // Close any open connections
  if (global.db) {
    await global.db.close();
  }
});

console.log('🧪 Test environment initialized for Cosmic Insights');