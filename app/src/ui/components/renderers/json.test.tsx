import { render } from "@testing-library/react";
import { Json } from "./json";

describe("Json", () => {
  it("should render a JSON stringified form of the object passed in", () => {
    expect(render(<Json value={{ foo: "bar", baz: 69, quux: true }} />).container).toMatchSnapshot();
  });
});
