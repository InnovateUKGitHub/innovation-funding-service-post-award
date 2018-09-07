import "jest";
import React from "react";
import { Section } from "../../../src/ui/components/layout/section";

import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("Section", () => {
    const aTitle = "a test title";
    it("should the right caption and title", () => {
        const wrapper = shallow(
        <Section title={aTitle}>
            <div>a child</div>
        </Section>
        );
        expect(wrapper
            .containsMatchingElement(<h2 className="govuk-heading-m govuk-!-margin-bottom-9">a test title</h2>))
            .toBeTruthy();
        expect(wrapper
            .containsMatchingElement(<div>a child</div>))
            .toBeTruthy();
    });
    it("should not render title if title prop is not passed in", () => {
        const wrapper = shallow(<Section/>);
        expect(wrapper
            .containsMatchingElement(<div className="govuk-!-margin-bottom-9" />))
            .toBeTruthy();
    });
});
