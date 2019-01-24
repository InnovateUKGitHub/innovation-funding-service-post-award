import "jest";
import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Accordion } from "../../src/ui/components";

Enzyme.configure({ adapter: new Adapter() });

describe("Accordion", () => {
  it("Renders with correct class", () => {
    const output = shallow(<Accordion />).html();
    expect(output).toContain(`class=\"acc-accordion\"`);
  });

  it("Renders with given children", () => {
    const output = shallow(<Accordion><span>child1</span><span>child2</span></Accordion>).html();
    expect(output).toContain(`child1`);
    expect(output).toContain(`child2`);
  });
});
