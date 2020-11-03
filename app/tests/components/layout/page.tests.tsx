import React from "react";
import { Page } from "../../../src/ui/components/layout/page";

import { shallow } from "enzyme";

describe("Page", () => {
    it("should render child element", () => {
        const wrapper = shallow(<Page pageTitle="title" backLink="backLink"><div>a test child</div></Page>);
        expect(wrapper
            .containsMatchingElement(<div>a test child</div>))
            .toBeTruthy();
    });
});
