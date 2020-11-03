
import {mount} from "enzyme";

import React from "react";
import {PhaseBanner} from "@ui/components";
import {findByQa} from "../helpers/find-by-qa";

describe("PhaseBanner", () => {
    it("should render feedback link", () => {
        const wrapper = mount(<PhaseBanner/>);
        const target = findByQa(wrapper, "phase-banner-link");

        expect(target.prop("href")).toBe("https://www.surveymonkey.co.uk/r/IFSPostAwardFeedback");
        expect(target.text()).toBe("feedback");
    });
});
