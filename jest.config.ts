import baseConfig from './jest.base.config';

export default {
  ...baseConfig,
  testRegex: '.spec.ts$',
  coverageDirectory: '<rootDir>/../coverage',
  cacheDirectory: '<rootDir>/../.cache/jest',
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/**/*.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!<rootDir>/**/**/*.integration.test.ts',
    '!<rootDir>/**/**/index.ts',
    '!<rootDir>/**/**/*.module.ts',
    '!<rootDir>/**/**/main.ts',
  ],
  coverageReporters: [['lcov', { projectRoot: './' }], 'text'],
  coverageThreshold: {
    global: {
      branches: 82,
      functions: 62,
      lines: 75,
      statements: 74,
    },
  },
};
