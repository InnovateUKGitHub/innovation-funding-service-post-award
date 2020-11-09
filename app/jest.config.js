module.exports = {
  testURL: "http://localhost",
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFilesAfterEnv: ["./config/jest-setup.js"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageDirectory: "dashboard/unit_testing",
  collectCoverageFrom: [
    "src/server/features/**/*.{ts,tsx}",
    "src/ui/components/**/*.{ts,tsx}",
    "src/ui/redux/**/*.{ts,tsx}",
    "src/ui/validators/**/*.{ts,tsx}",
  ],
  coverageReporters: ["text", "html", "lcov"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/tests/.*(tests|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js"],
  testResultsProcessor: "jest-bamboo-reporter",
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  moduleNameMapper: {
    "@server/(.*)": "<rootDir>/src/server/$1",
    "@shared/(.*)": "<rootDir>/src/shared/$1",
    "@framework/(.*)": "<rootDir>/src/framework/$1",
    "@ui/(.*)": "<rootDir>/src/ui/$1",
    "@util/(.*)": "<rootDir>/src/util/$1",
    "@content/(.*)": "<rootDir>/src/content/$1",
  },
};
