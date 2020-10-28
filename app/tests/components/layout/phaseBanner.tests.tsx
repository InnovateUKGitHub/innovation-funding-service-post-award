import "jest";
import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import React from "react";
import {PhaseBanner} from "@ui/components";
import {findByQa} from "../helpers/find-by-qa";

Enzyme.configure({adapter: new Adapter()});

describe("PhaseBanner", () => {
    it("should render feedback link", () => {
        const wrapper = mount(<PhaseBanner/>);
        const target = findByQa(wrapper, "phase-banner-link");

        expect(target.prop("href")).toBe("https://www.surveymonkey.co.uk/r/IFSPostAwardFeedback");
        expect(target.text()).toBe("feedback");
    });
});
