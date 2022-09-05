import { render } from "@testing-library/react";
import { LineBreakList } from "./lineBreakList";

describe("LineBreakList", () => {
  it("should create a list of components separated with line-breaks", () => {
    const items = [
      <p key="1">We'll</p>,
      <p key="2">Meet</p>,
      <p key="3">Again</p>,
      <p key="4">Don't</p>,
      <p key="5">Know</p>,
      <p key="6">Where</p>,
      <p key="7">Don't</p>,
      <p key="8">Know</p>,
      <p key="9">When</p>,
    ];
    const { container } = render(<LineBreakList items={items} />);
    expect(container).toMatchSnapshot();
  });
});
