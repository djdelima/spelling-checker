export default {
  setupFilesAfterEnv: ['<rootDir>/../jest.setup.js'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  testTimeout: 15000,
  testPathIgnorePatterns: ['<rootDir>/__mocks__/*'],
};
