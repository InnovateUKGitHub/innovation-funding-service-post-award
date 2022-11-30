/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/naming-convention */
require("@testing-library/jest-dom");
require("@testing-library/jest-dom/extend-expect");

const React = require("react");
global.React = React;

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
  v4: () => `1234-stub-uuid-${Math.floor(Math.random() * 100000)}`,
}));

// TODO: Delete the next few lines...
// https://github.com/kkomelin/isomorphic-dompurify/issues/91#issuecomment-1012645198
const util = require("util");
global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder;
