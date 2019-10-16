import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { SectionPanel } from "../../../src/ui/components/layout/sectionPanel";

Enzyme.configure({ adapter: new Adapter() });

describe("SectionPanel", () => {
  it("should render with the correct title", () => {
    const wrapper = mount(<SectionPanel title="test title" />);

    expect(wrapper.text()).toEqual("test title");
  });
});
