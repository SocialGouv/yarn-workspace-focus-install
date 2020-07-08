const { defaults } = require("jest-config");

const ignorePatterns = [
  "<rootDir>/components",
  "<rootDir>/coverage",
  "<rootDir>/e2e",
  "<rootDir>/environments",
  "<rootDir>/types",
];

module.exports = {
  collectCoverageFrom: ["src/**/*.ts"],
  moduleDirectories: ["src", ...defaults.moduleDirectories],
  moduleNameMapper: {
    "^@socialgouv/kosko-charts(.*)$": "<rootDir>/src$1",
  },
  testEnvironment: "node",
  testPathIgnorePatterns: [
    ...defaults.testPathIgnorePatterns,
    ...ignorePatterns,
  ],
  watchPathIgnorePatterns: ignorePatterns,
};
