import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { InsetText } from "../../../src/ui/components/layout/insetText";

Enzyme.configure({ adapter: new Adapter() });

describe("InsetText", () => {
  it("should render with the correct text", () => {
    const wrapper = mount(<InsetText text="test text"/>);
    expect(wrapper.text()).toEqual("test text");
  });

  it("should render as null if no text is given", () => {
    const wrapper = mount(<InsetText text={null} />);
    expect(wrapper.html()).toBe(null);
  });
});
