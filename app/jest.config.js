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
    "src/ui/**/*.{ts,tsx,json}",
  ],
  coverageReporters: ["text", "html", "lcov"],
  transformIgnorePatterns: ["/node_modules/(?!uuid)"],
  testRegex: "/src/.*\\.(test|spec)\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
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
    "@client/(.*)": "<rootDir>/src/client/$1",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/tests/__mocks__/fileMock.js",
    "\\.(css|less|apex)$": "<rootDir>/tests/__mocks__/styleMock.js",
    "\\.mdx$": "<rootDir>/tests/__mocks__/mdxMock.js",
  },
};
