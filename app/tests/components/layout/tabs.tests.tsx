import "jest";
import React from "react";
import { Tabs, TabItem } from "../../../src/ui/components/layout/tabs";

import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

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
            expect(item.props().role).toBe("presentation");
        });
    });

    it("should render the selected tab", () => {
        const wrapper = Enzyme.shallow(<Tabs tabList={aTabList} />);
        expect(wrapper.html()).toContain(`<a href="#" class="govuk-tabs__tab" aria-selected="true">Project change requests</a>`);
    });

    it("should render the unselected tab", () => {
        const wrapper = Enzyme.shallow(<Tabs tabList={aTabList} />);
        expect(wrapper.html()).toContain(`<a href="#" class="govuk-tabs__tab">Claims</a>`);
    });

    it("should not render tabs if passed an empty tab list", () => {
        const wrapper = Enzyme.shallow(<Tabs tabList={[]}/>);
        expect(wrapper.html()).toBeNull();
    });
    it("should not render tabs if passed null tab list", () => {
        const wrapper = Enzyme.shallow(<Tabs tabList={null}/>);
        expect(wrapper.html()).toBeNull();
    });
});
