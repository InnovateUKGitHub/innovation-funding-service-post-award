/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const abstractFiles = ["commandBase.ts"];

module.exports = {
  verbose: false,
  coverageDirectory: "dashboard/unit_testing",
  testEnvironment: "jsdom",
  maxWorkers: 4,
  testEnvironmentOptions: {
    url: "http://localhost",
  },
  setupFilesAfterEnv: ["<rootDir>/config/jest-setup.js"],
  coveragePathIgnorePatterns: ["/node_modules/", "\\.(test|spec)\\.", "stubDtos", "\\.page\\.", ...abstractFiles],
  collectCoverageFrom: [
    "src/server/features/**/*.{ts,tsx}",
    "src/framework/util/*.{ts,tsx,json}",
    "src/ui/containers/**/*.{ts,tsx,json}",
    "src/ui/components/**/*.{ts,tsx,json}",
    "src/ui/features/**/*.{ts,tsx,json}",
    "src/ui/hooks/**/*.{ts,tsx,json}",
    "src/ui/helpers/**/*.{ts,tsx,json}",
    "src/ui/styles/**/*.{ts,tsx,json}",
    "src/ui/redux/**/*.{ts,tsx}",
    "src/ui/validators/**/*.{ts,tsx}",
  ],
  coverageReporters: ["text", "html", "lcov"],
  transformIgnorePatterns: ["/node_modules/(?!uuid)"],
  testRegex: "/src/.*\\.(test|spec)\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js"],
  testResultsProcessor: "jest-bamboo-reporter",
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
  moduleNameMapper: {
    "@server/(.*)": "<rootDir>/src/server/$1",
    "@shared/(.*)": "<rootDir>/src/shared/$1",
    "@framework/(.*)": "<rootDir>/src/framework/$1",
    "@ui/(.*)": "<rootDir>/src/ui/$1",
    "@util/(.*)": "<rootDir>/src/util/$1",
    "@copy/(.*)": "<rootDir>/src/copy/$1",
    "@gql/(.*)": "<rootDir>/src/gql/$1",
    "@tests/(.*)": "<rootDir>/tests/$1",
  },
};
