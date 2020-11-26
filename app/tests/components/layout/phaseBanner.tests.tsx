// tslint:disable-next-line: import-blacklist
import { mount } from "enzyme";

import React from "react";
import { PhaseBanner } from "@ui/components";
import { findByQa } from "../helpers/find-by-qa";
import { TestBed, TestBedContent } from "@shared/TestBed";

describe("<PhaseBanner />", () => {
  const stubContent = {
    components: {
      phaseBannerContent: {
        newServiceMessage: { content: "stub-newServiceMessage" },
        feedbackMessage: { content: "stub-feedback" },
        helpImprove: { content: "stub-helpImprove" },
        betaText: {content: "stub-betaText" }
      },
    },
  };
  const setup = () =>
    mount(
      <TestBed content={stubContent as TestBedContent}>
        <PhaseBanner />
      </TestBed>,
    );

  describe("@renders", () => {
    it("a beta element", () => {
      const wrapper = setup();
      const target = findByQa(wrapper, "phase-banner");

      expect(target.text()).toBe(stubContent.components.phaseBannerContent.betaText.content);
    });

    it("a link", () => {
      const wrapper = setup();
      const target = findByQa(wrapper, "phase-banner-link");

      expect(target.prop("href")).toBe("https://www.surveymonkey.co.uk/r/IFSPostAwardFeedback");
      expect(target.text()).toBe(stubContent.components.phaseBannerContent.feedbackMessage.content);
    });
  });
});
