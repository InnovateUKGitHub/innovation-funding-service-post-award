import "jest";
import React from "react";
import { Title } from "../../../src/ui/components/layout/title";

import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("Title", () => {
    const aCaption = "a test caption";
    const aTitle = "a test title";
    it("should render caption", () => {
        const result = Title({ caption: aCaption, title: aTitle });
        const wrapper = shallow(result!);
        expect(wrapper
            .containsMatchingElement(<h1 className="govuk-heading-xl clearFix">a test title</h1>))
            .toBeTruthy();
    });
    it("should render title", () => {
        const result = Title({ caption: aCaption, title: aTitle });
        const wrapper = shallow(result!);
        expect(wrapper
            .containsMatchingElement(<span className="govuk-caption-xl">a test caption</span>))
            .toBeTruthy();
    });
    it("should not reder caption if prop is not passed in", () => {
        const result = Title({title: aTitle });
        const wrapper = shallow(result!);
        expect(wrapper
            .containsMatchingElement(<h1 className="govuk-heading-xl clearFix">a test title</h1>))
            .toBeTruthy();
        expect(wrapper
            .containsMatchingElement(<span className="govuk-caption-xl">a test caption</span>))
            .toBeFalsy();
    });
});
