module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  testPathIgnorePatterns: ['/node_modules/', '/lms-backend/'],
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.app.json' }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg)$': '<rootDir>/test/__mocks__/fileMock.js',
  },
};