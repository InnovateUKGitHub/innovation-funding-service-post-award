/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/naming-convention */
require("@testing-library/jest-dom");

const React = require("react");
const util = require("util");

const ReactTestingLibrary = require("@testing-library/react");

ReactTestingLibrary.configure({ testIdAttribute: "data-qa" });

jest.mock("undici", () => {
  return {
    fetch: jest.fn().mockResolvedValue("a happy response"),
    Agent: class MockAgent {},
  };
});

global.React = React;
global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder;
global.ReadableStream = util.ReadableStream;
global.newrelic = null;
