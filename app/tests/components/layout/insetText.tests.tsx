import React from "react";
import { mount } from "enzyme";

import { InsetText } from "../../../src/ui/components/layout/insetText";

describe("InsetText", () => {

  const setup = (content: string | null) => {
    return mount(<InsetText text={content}/>);
  };

  it("should render with the correct text", () => {
    const wrapper = setup("test text");
    expect(wrapper.text()).toEqual("test text");
  });

  it("should render as null if no text is given", () => {
    const wrapper = setup(null);
    expect(wrapper.children().length).toEqual(0);
  });
});
