const { defaults } = require("jest-config");

const ignorePatterns = [
  "<rootDir>/components",
  "<rootDir>/coverage",
  "<rootDir>/e2e",
  "<rootDir>/environments",
  "<rootDir>/types",
];

module.exports = {
  moduleDirectories: ["src", ...defaults.moduleDirectories],
  moduleNameMapper: {
    "^@socialgouv/kosko-charts(.*)$": "<rootDir>/src$1",
  },
  collectCoverageFrom: ["src/**/*.ts"],
  testEnvironment: "node",
  testPathIgnorePatterns: [
    ...defaults.testPathIgnorePatterns,
    ...ignorePatterns,
  ],
  watchPathIgnorePatterns: ignorePatterns,
};
