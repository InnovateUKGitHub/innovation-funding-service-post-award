import React from "react";
// tslint:disable-next-line: import-blacklist
import { mount } from "enzyme";

import {
  HashTabItem,
  HashTabs,
} from "../../../src/ui/components/layout/hashTabs";
import { findByQa } from "../helpers/find-by-qa";

describe("Hash Tabs", () => {

  const selectedTabClass = "govuk-tabs__list-item--selected";

  const tabStub: HashTabItem[] = [
    { text: "Claims", hash: "claims", content: "Claims content", qa: "claim-tab" },
    {
      text: "Project change requests",
      hash: "pcr",
      content: "Project change requests content",
      qa: "pcr-tab"
    },
  ];

  const setup = (tabs: any) => {
    return mount(<HashTabs tabList={tabs} qa="tab-list-qa"/>);
  };

  it("should render the list of tabs with the first selected", () => {
    const wrapper = setup(tabStub);

    const tabs = findByQa(wrapper, "tab-list-qa").children();
    expect(tabs.length).toBe(2);

    // verify first item is selected
    const selectedTab = findByQa(wrapper, "claim-tab");
    expect(selectedTab.hasClass(selectedTabClass)).toBeTruthy();
    expect(selectedTab.children().first().props()["aria-selected"]).toBeTruthy();

    tabs.forEach((item, i) => {
      // validate li
      const li = item.props();
      expect(li.className).toContain("govuk-tabs__list-item");
      expect(li.role).toBe("presentation");
      expect(li["data-qa"]).toBe(tabStub[i].qa); // a bit ugly

      // validate tab child
      const a = item.children().first().props();
      expect(a.className).toBe("govuk-tabs__tab");
      expect(a.role).toBe("tab");
    });
  });

  it("should render the unselected tab", () => {
    const wrapper = setup(tabStub);

    expect(wrapper.html()).toContain(
      `<a href="#pcr" class="govuk-tabs__tab" aria-selected="false" role="tab">Project change requests</a>`
    );
  });

  it("should not render tabs if passed an empty tab list", () => {
    const wrapper = setup([]);

    expect(wrapper.html()).toBeNull();
  });

  it("should not render tabs if passed null tab list", () => {
    const wrapper = setup(null);
    expect(wrapper.html()).toBeNull();
  });

  it("should render all tab contents in sections", () => {
    const wrapper = setup(tabStub);

    const sections = wrapper.find("section").map((x) => x);
    expect(sections.length).toBe(tabStub.length);
    tabStub.forEach((tab, i) => {
      expect(sections[i].props().className).toContain("govuk-tabs__panel");
      expect(sections[i].html()).toContain(tab.content);
    });
  });

  it("should render hidden tabs with hidden class", () => {
    const wrapper = setup(tabStub);

    const sections = wrapper.find("section").map((x) => x);
    expect(sections.length).toBe(2);
    expect(sections[0].props().className).not.toContain(
      "govuk-tabs__panel--hidden"
    );
    expect(sections[1].props().className).toContain(
      "govuk-tabs__panel--hidden"
    );
  });
});
