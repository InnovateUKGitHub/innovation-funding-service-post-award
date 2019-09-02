// tslint:disable: no-duplicate-string
import "jest";
import React from "react";
import { Messages } from "../../../src/ui/components/renderers";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { mount } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Messages", () => {
  it("should render given message", () => {
    const wrapper = mount(<Messages messages={["first"]} />);
    expect(wrapper.html()).toContain("<span>first</span>");
  });

  it("should render an aria live", () => {
    const wrapper = mount(<Messages messages={["first"]} />);
    expect(wrapper.html()).toContain(`<div aria-live="polite">`);
  });

  it("should render given messages as an array", () => {
    const wrapper = mount(<Messages messages={["first", "second"]} />);

    // find contents of the AriaLive
    const messages = wrapper.childAt(0).childAt(0).children().map(x => x);

    expect(messages.length).toBe(2);
    expect(messages[0].html()).toContain("<span>first</span>");
    expect(messages[1].html()).toContain("<span>second</span>");
  });

});
