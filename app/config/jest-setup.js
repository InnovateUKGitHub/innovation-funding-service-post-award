/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/naming-convention */
require("@testing-library/jest-dom");

const React = require("react");
global.React = React;

const ReactTestingLibrary = require("@testing-library/react");

ReactTestingLibrary.configure({ testIdAttribute: "data-qa" });

jest.mock("undici", () => {
  return {
    fetch: jest.fn().mockResolvedValue("a happy response"),
    Agent: class MockAgent {},
  };
});

// TODO: Delete the next few lines...
// https://github.com/kkomelin/isomorphic-dompurify/issues/91#issuecomment-1012645198
const util = require("util");
global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder;
global.newrelic = null;
