import "jest";
import React from "react";
import { PhaseBanner } from "../../../src/ui/components/layout/phaseBanner";

import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("PhaseBanner", () => {

    it("should render feedback <a>", () => {
        const wrapper = shallow(<PhaseBanner />);
        expect(wrapper
            .containsMatchingElement(<a className="govuk-link" href="https://www.surveymonkey.co.uk/r/IFSPostAwardFeedback">feedback</a>))
            .toBeTruthy();
    });
});
