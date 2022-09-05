import { render } from "@testing-library/react";
import { SvgCrown } from "./crownSvg";

describe("SvgCrown", () => {
  it("should render with the passed in color", () => {
    expect(render(<SvgCrown colour="#ffff00"/>).container).toMatchSnapshot();
  });
});
