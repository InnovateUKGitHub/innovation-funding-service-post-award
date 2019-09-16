import "jest";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { mount, shallow } from "enzyme";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";

Enzyme.configure({ adapter: new Adapter() });

describe("SummaryList", () => {
    it("Renders without borders", () => {
        const output = shallow(
            <SummaryList noBorders={true} qa="test-list">
                <SummaryListItem label="Label" content="Content" qa="test-item"/>
            </SummaryList>
        );
        expect(output.hasClass("govuk-summary-list govuk-summary-list--no-border")).toBe(true);
    });
    it("Renders an action", () => {
        const output = mount(
          <SummaryList qa="test-list">
            <SummaryListItem label="Label" content="Content" action={<a href="#test">Test</a>} qa="test-item"/>
          </SummaryList>
        );
        expect(output.containsMatchingElement(<a href="#test">Test</a>)).toBe(true);
    });
    it("Renders with correct qa", () => {
      const output = mount(
        <SummaryList qa="test-list">
          <SummaryListItem qa="testQa" label="Label" content="Content" action={<a href="#test">Test</a>}/>
        </SummaryList>
      );
      expect(output.find("div").prop("data-qa")).toEqual("testQa");
    });
});
