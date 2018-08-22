import "jest";
import React from "react";
import { Page } from "../../../src/components/layout/page";

import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("Section", () => {
    it("should render child element", () => {
        const wrapper = shallow(<Page><div>a test child</div></Page>);
        expect(wrapper
            .containsMatchingElement(<div>a test child</div>))
            .toBeTruthy();
    });
});
