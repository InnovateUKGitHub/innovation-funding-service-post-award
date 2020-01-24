import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { ListItem } from "../../../src/ui/components/layout/listSection";

Enzyme.configure({ adapter: new Adapter() });

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
