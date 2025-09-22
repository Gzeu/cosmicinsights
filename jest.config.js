module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'server.js',
        '!node_modules/**',
        '!coverage/**',
        '!logs/**'
    ],
    testMatch: [
        '**/__tests__/**/*.js',
        '**/?(*.)+(spec|test).js'
    ],
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    testTimeout: 30000
};