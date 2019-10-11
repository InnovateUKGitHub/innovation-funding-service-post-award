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
  it("should render with warning styles", () => {
    const wrapper = mount(<ListItem icon="warning"/>);
    expect(wrapper.find("div").prop("className")).toContain("acc-message__error");
  });

  it("should render with edit styles", () => {
    const wrapper = mount(<ListItem icon="edit"/>);
    expect(wrapper.find("div").prop("className")).toContain("acc-message__edit");
  });

  it("should render with default styles", () => {
    const wrapper = mount(<ListItem />);
    expect(wrapper.find("div").prop("className")).not.toContain("acc-message__error");
    expect(wrapper.find("div").prop("className")).not.toContain("acc-message__edit");
  });

});
