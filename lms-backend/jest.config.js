module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    verbose: true,
    transform: {},
    setupFilesAfterEnv: [],
    coveragePathIgnorePatterns: ['/node_modules/', '/uploads/'],
};