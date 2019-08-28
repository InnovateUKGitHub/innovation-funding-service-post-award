import "jest";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { mount, shallow } from "enzyme";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";

Enzyme.configure({ adapter: new Adapter() });

describe("SummaryList", () => {
    it("Renders without borders", () => {
        const output = shallow(
            <SummaryList noBorders={true}>
                <SummaryListItem label="Label" content="Content" />
            </SummaryList>
        );
        expect(output.hasClass("govuk-summary-list govuk-summary-list--no-border")).toBe(true);
    });
    it("Renders an action", () => {
        const output = mount(
          <SummaryList>
            <SummaryListItem label="Label" content="Content" action={<a href="#test">Test</a>}/>
          </SummaryList>
        );
        expect(output.containsMatchingElement(<a href="#test">Test</a>)).toBe(true);
    });
});
