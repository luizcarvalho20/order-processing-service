module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  globalTeardown: "<rootDir>/tests/jest.teardown.ts",
};
