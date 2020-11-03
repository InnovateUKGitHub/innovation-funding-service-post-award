import React from "react";
import { shallow } from "enzyme";

import { TextHint } from "../../../src/ui/components/layout/textHint";

describe("TextHint", () => {
  it("should render with the correct text", () => {
    const wrapper = shallow(<TextHint text="test text" />);

    expect(wrapper.text()).toEqual("test text");
  });

  it("should render null if no text is given", () => {
    const wrapper = shallow(<TextHint text={null} />);

    expect(wrapper.html()).toBe(null);
  });
});
