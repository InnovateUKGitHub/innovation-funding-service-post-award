/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/naming-convention */
require("@testing-library/jest-dom/extend-expect");
const ReactTestingLibrary = require("@testing-library/react");

ReactTestingLibrary.configure({ testIdAttribute: "data-qa" });

// Note: Mock hooks so that spyOn works
jest.mock("@ui/hooks", () => ({
  __esModule: true,
  ...jest.requireActual("@ui/hooks"),
}));
