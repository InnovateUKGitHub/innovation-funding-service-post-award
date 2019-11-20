import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { ListItem, ListSection } from "../../../src/ui/components/layout/listSection";

Enzyme.configure({ adapter: new Adapter() });

describe("ListSection", () => {
  it("should render with the correct title", () => {
    const wrapper = mount(<ListSection title="test title" />);
    expect(wrapper.text()).toEqual("test title");
  });
});

describe("ListItem", () => {
  it("should render with action required styles", () => {
    const wrapper = mount(<ListItem actionRequired={true} />);
    expect(wrapper.find("div").prop("className")).toContain("acc-list-item__actionRequired");
  });

  it("should render with default styles", () => {
    const wrapper = mount(<ListItem />);
    expect(wrapper.find("div").prop("className")).not.toContain("acc-list-item__actionRequired");
  });

});
