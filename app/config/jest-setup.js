/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/naming-convention */
require("@testing-library/jest-dom");
require("@testing-library/jest-dom/extend-expect");

const ReactTestingLibrary = require("@testing-library/react");

ReactTestingLibrary.configure({ testIdAttribute: "data-qa" });

// Note: Mock hooks so that spyOn works
jest.mock("@ui/hooks", () => ({
  __esModule: true,
  ...jest.requireActual("@ui/hooks"),
}));

// uuid package has known issues with jest importing
jest.mock("uuid", () => ({
  __esModule: true,
  v4: () => `1234-stub-uuid-${Math.floor(Math.random() * 100000)}`
}));
