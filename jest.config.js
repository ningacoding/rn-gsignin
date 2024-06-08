const testPathIgnorePatterns = [
  '/node_modules/',
  '<rootDir>/(?:.+?)/__tests__/_(?:.+?)', //ignore files prepended with underscore
];
/** @type {import('jest').Config} */
const config = {
  preset: 'react-native',
  modulePathIgnorePatterns: [
    '<rootDir>/example/node_modules',
    '<rootDir>/lib/',
  ],
  moduleNameMapper: {
    '@react-native-google-signin/google-signin': '<rootDir>/src/index.ts',
  },
  testPathIgnorePatterns,
};

module.exports = config;
