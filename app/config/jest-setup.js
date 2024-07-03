import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";
import React from "react";

global.React = React;

configure({ testIdAttribute: "data-qa" });

// TODO: Delete the next few lines...
// https://github.com/kkomelin/isomorphic-dompurify/issues/91#issuecomment-1012645198
const util = require("util");
global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder;
