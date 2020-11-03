import React from "react";
import { mount } from "enzyme";

import { InsetText } from "../../../src/ui/components/layout/insetText";

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
