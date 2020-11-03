import React from "react";
import Enzyme from "enzyme";

import { HashTabItem, HashTabs } from "../../../src/ui/components/layout/hashTabs";

describe("Hash Tabs", () => {
  const aTabList: HashTabItem[] = [
    { text: "Claims", hash: "claims", content: "Claims content" },
    { text: "Project change requests", hash: "pcr", content: "Project change requests content" }
  ];

  it("should render the list of tabs", () => {
    const wrapper = Enzyme.mount(<HashTabs tabList={aTabList}/>);
    const items = wrapper.find("li");
    expect(items.length).toBe(2);
    items.forEach(item => {
      expect(item.props().className).toContain("govuk-tabs__list-item");
      expect(item.props().role).toBe("presentation");
      expect(item.childAt(0).props().role).toBe("tab");
    });
  });

  it("should render the first tab as selected if no hash", () => {
    const wrapper = Enzyme.shallow(<HashTabs tabList={aTabList}/>);
    const selected = wrapper.find("li").filterWhere(x => x.hasClass("govuk-tabs__list-item--selected")).map(x => x);
    expect(selected.length).toBe(1);
    expect(selected[0].html()).toContain(`<a href="#claims" class="govuk-tabs__tab" aria-selected="true" role="tab">Claims</a>`);
  });

  it("should render the unselected tab", () => {
    const wrapper = Enzyme.shallow(<HashTabs tabList={aTabList}/>);
    expect(wrapper.html()).toContain(`<a href="#pcr" class="govuk-tabs__tab" aria-selected="false" role="tab">Project change requests</a>`);
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

  it("should render all tab contents in sections", () => {
    const wrapper = Enzyme.shallow(<HashTabs tabList={aTabList}/>);
    const sections = wrapper.find("section").map(x => x);
    expect(sections.length).toBe(aTabList.length);
    aTabList.forEach((tab,i) => {
      expect(sections[i].props().className).toContain("govuk-tabs__panel");
      expect(sections[i].html()).toContain(tab.content);
    });
  });

  it("should render hidden tabs with hidden class", () => {
    const wrapper = Enzyme.shallow(<HashTabs tabList={aTabList}/>);
    const sections = wrapper.find("section").map(x => x);
    expect(sections.length).toBe(2);
    expect(sections[0].props().className).not.toContain("govuk-tabs__panel--hidden");
    expect(sections[1].props().className).toContain("govuk-tabs__panel--hidden");
  });
});
