// tslint:disable-next-line: import-blacklist
import { mount } from "enzyme";

import React from "react";
import { PhaseBanner } from "@ui/components";
import { findByQa } from "../helpers/find-by-qa";

describe("<PhaseBanner />", () => {
  const setup = () => mount(<PhaseBanner />);

  describe("@renders", () => {
    it("a beta element", () => {
      const wrapper = setup();
      const target = findByQa(wrapper, "phase-banner");

      expect(target.text()).toBe("beta");
    });

    it("a link", () => {
      const wrapper = setup();
      const target = findByQa(wrapper, "phase-banner-link");

      expect(target.prop("href")).toBe("https://www.surveymonkey.co.uk/r/IFSPostAwardFeedback");
      expect(target.text()).toBe("feedback");
    });
  });
});
