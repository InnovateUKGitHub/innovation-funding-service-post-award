import "jest";
import React from "react";
import { Tabs } from "../../../src/components/layout/tabs";

import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("Tabs", () => {
    const aTabList = ["Claims", "Project change requests", "Forecasts", "Project details"];
    const aSelectedTab = aTabList[1];
    it("should render the right selected tab", () => {
        const result = Tabs({ tabList:  aTabList, selected: aSelectedTab});
        const wrapper = shallow(result);
        expect(wrapper
            .containsMatchingElement(<a href="#" className="govuk-tabs__tab" aria-selected={true}>Project change requests</a>))
            .toBeTruthy();
        expect(wrapper
            .containsMatchingElement(<a href="#" className="govuk-tabs__tab" aria-selected={false}>Claims</a>))
            .toBeTruthy();
        expect(wrapper
            .containsMatchingElement(<a href="#" className="govuk-tabs__tab" aria-selected={false}>Forecasts</a>))
            .toBeTruthy();
        expect(wrapper
            .containsMatchingElement(<a href="#" className="govuk-tabs__tab" aria-selected={false}>Project details</a>))
            .toBeTruthy();
    });
});
