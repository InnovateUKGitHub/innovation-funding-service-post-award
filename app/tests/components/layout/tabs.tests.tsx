import React from "react";
import Enzyme from "enzyme";

import { TabItem, Tabs } from "../../../src/ui/components/layout/tabs";

describe("Tabs", () => {
    const aTabList: TabItem[] = [
        { text: "Claims", url: "#" },
        { text: "Project change requests", url: "#", selected: true }
    ];

    it("should render the list of tabs", () => {
        const wrapper = Enzyme.mount(<Tabs tabList={aTabList} />);
        const items = wrapper.find("li");
        expect(items.length).toBe(2);
        items.forEach(item => {
            expect(item.props().className).toContain("govuk-tabs__list-item");
            expect(item.props().role).toBe("tab");
        });
    });

    it("should render the selected tab", () => {
        const wrapper = Enzyme.shallow(<Tabs tabList={aTabList} />);
        expect(wrapper.html()).toContain(`<li role="tab" aria-selected="true" class="govuk-tabs__list-item govuk-tabs__list-item--selected">`);
    });

    it("should render the unselected tab", () => {
        const wrapper = Enzyme.shallow(<Tabs tabList={aTabList} />);
        expect(wrapper.html()).toContain(`<a href="#" class="govuk-tabs__tab">Claims</a>`);
    });

    it("should not render tabs if passed an empty tab list", () => {
      const tabList = [] as any;
      const wrapper = Enzyme.shallow(<Tabs tabList={tabList}/>);
      expect(wrapper.html()).toBeNull();
    });
    it("should not render tabs if passed null tab list", () => {
      const tabList = null as any;
      const wrapper = Enzyme.shallow(<Tabs tabList={tabList}/>);
      expect(wrapper.html()).toBeNull();
    });
});
