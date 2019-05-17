import "jest";
import React from "react";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { HashTabItem, HashTabs } from "../../../src/ui/components/layout/hashTabs";

Enzyme.configure({ adapter: new Adapter() });

describe("Hash Tabs", () => {
  const aTabList: HashTabItem[] = [
    { text: "Claims", hash: "claims", content: "Claims content" },
    { text: "Project change requests", hash: "pcr", content: "Project change requests content", default: true }
  ];

  const aTabListWithNoDefault: HashTabItem[] = [
    { text: "Claims", hash: "claims", content: "Claims content" },
    { text: "Project change requests", hash: "pcr", content: "Project change requests content" }
  ];

  it("should render the list of tabs", () => {
    const wrapper = Enzyme.mount(<HashTabs tabList={aTabList}/>);
    const items = wrapper.find("li");
    expect(items.length).toBe(2);
    items.forEach(item => {
      expect(item.props().className).toContain("govuk-tabs__list-item");
      expect(item.props().role).toBe("tab");
    });
  });

  it("should render the default tab as selected", () => {
    const wrapper = Enzyme.shallow(<HashTabs tabList={aTabList}/>);
    expect(wrapper.html()).toContain(`<a href="#pcr" class="govuk-tabs__tab govuk-tabs__tab--selected">Project change requests</a>`);
  });

  it("should render the first tab as selected if no default tab", () => {
    const wrapper = Enzyme.shallow(<HashTabs tabList={aTabListWithNoDefault}/>);
    expect(wrapper.html()).toContain(`<a href="#claims" class="govuk-tabs__tab govuk-tabs__tab--selected">Claims</a>`);
  });

  it("should render the unselected tab", () => {
    const wrapper = Enzyme.shallow(<HashTabs tabList={aTabList}/>);
    expect(wrapper.html()).toContain(`<a href="#claims" class="govuk-tabs__tab">Claims</a>`);
  });

  it("should not render tabs if passed an empty tab list", () => {
    const tabList = [] as any;
    const wrapper = Enzyme.shallow(<HashTabs tabList={tabList}/>);
    expect(wrapper.html()).toBeNull();
  });
  it("should not render tabs if passed null tab list", () => {
    const tabList = null as any;
    const wrapper = Enzyme.shallow(<HashTabs tabList={tabList}/>);
    expect(wrapper.html()).toBeNull();
  });
});
