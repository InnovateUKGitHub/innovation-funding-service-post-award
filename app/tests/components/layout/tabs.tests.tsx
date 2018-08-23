import "jest";
import React from "react";
import { Tabs } from "../../../src/components/layout/tabs";

import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("Tabs", () => {
    const aTabList = ["Claims", "Project change requests"];
    const aSelectedTab = aTabList[1];
    it("should render the selected tab", () => {
        const result = Tabs({ tabList: aTabList, selected: aSelectedTab });
        const wrapper = shallow(result);
        expect(wrapper
            .containsMatchingElement(<a href="#" className="govuk-tabs__tab" aria-selected={true}>Project change requests</a>))
            .toBeTruthy();
    });
    it("should render the unselected tab", () => {
        const result = Tabs({ tabList: aTabList, selected: aSelectedTab });
        const wrapper = shallow(result);
        expect(wrapper
            .containsMatchingElement(<a href="#" className="govuk-tabs__tab" aria-selected={false}>Claims</a>))
            .toBeTruthy();
    });
    it("should not render tabs if passed an empty tab list", () => {
        const anEmptyTabList = [];
        const result = Tabs({ tabList: anEmptyTabList, selected: aSelectedTab });
        expect(result).toBeNull();
    });
    it("should not render tabs if passed null tab list", () => {
        const result = Tabs({ tabList: null, selected: aSelectedTab });
        expect(result).toBeNull();
    });
    it("should render both tabs and set aria-selected=false if selected is null", () => {
        const result = Tabs({ tabList: aTabList, selected: null });
        const wrapper = shallow(result);
        expect(wrapper
            .containsMatchingElement(<a href="#" className="govuk-tabs__tab" aria-selected={false}>Project change requests</a>))
            .toBeTruthy();
        expect(wrapper
            .containsMatchingElement(<a href="#" className="govuk-tabs__tab" aria-selected={false}>Claims</a>))
            .toBeTruthy();
    });
    it("should render both tabs and set aria-selected=false if selected is not in tabs list", () => {
        const result = Tabs({ tabList: aTabList, selected: "a test selected tab" });
        const wrapper = shallow(result);
        expect(wrapper
            .containsMatchingElement(<a href="#" className="govuk-tabs__tab" aria-selected={false}>Project change requests</a>))
            .toBeTruthy();
        expect(wrapper
            .containsMatchingElement(<a href="#" className="govuk-tabs__tab" aria-selected={false}>Claims</a>))
            .toBeTruthy();
    });
});
