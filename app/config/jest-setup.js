require("@testing-library/jest-dom/extend-expect");

const ReactTestingLibrary = require("@testing-library/react");
const Enzyme = require("enzyme");
const Adapter = require("@wojtekmaj/enzyme-adapter-react-17");

Enzyme.configure({ adapter: new Adapter() });

ReactTestingLibrary.configure({ testIdAttribute: "data-qa" });

// Note: Mock hooks so that spyOn works
jest.mock("@ui/hooks", () => ({
  __esModule: true,
  ...jest.requireActual("@ui/hooks"),
}));
