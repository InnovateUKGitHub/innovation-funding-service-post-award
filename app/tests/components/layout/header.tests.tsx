import "jest";
import React from "react";
import { Header } from "../../../src/components/layout/header";

import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("Header", () => {
    describe("header contains the expected html tags", () => {
        it("should render 'Innovation Funding Service' <a>", () => {
            const result = Header({});
            const wrapper = shallow(result);
            expect(wrapper
                .containsMatchingElement(<a className="govuk-header__link govuk-header__link--service-name">Innovation Funding Service</a>))
                .toBeTruthy();
        });
    });
});
