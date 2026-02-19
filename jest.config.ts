module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  globalTeardown: "<rootDir>/tests/jest.teardown.js",
  setupFiles: ["<rootDir>/tests/jest.env.js"],
};
