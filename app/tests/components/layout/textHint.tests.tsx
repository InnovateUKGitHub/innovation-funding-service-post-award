import "jest";
import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { TextHint } from "../../../src/ui/components/layout/textHint";

Enzyme.configure({ adapter: new Adapter() });

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
