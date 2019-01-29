// tslint:disable: no-duplicate-string
import "jest";
import React from "react";
import { Messages } from "../../../src/ui/components/renderers";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { mount } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Messages", () => {
  it("should render null with no messages", () => {
    const wrapper = mount(<Messages messages={[]} />);
    expect(wrapper.html()).toBeNull();
  });

  it("should render given message", () => {
    const wrapper = mount(<Messages messages={["first"]} />);
    expect(wrapper.html()).toContain("<span>first</span>");
  });

  it("should render given messages as an array", () => {
    const wrapper = mount(<Messages messages={["first", "second"]} />);
    expect(wrapper.children().length).toBe(2);
    expect(wrapper.children().at(0).html()).toContain("<span>first</span>");
    expect(wrapper.children().at(1).html()).toContain("<span>second</span>");
  });

});
