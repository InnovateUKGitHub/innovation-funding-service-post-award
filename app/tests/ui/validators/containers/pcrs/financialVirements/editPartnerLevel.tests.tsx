import React from "react";

import { useEditPartnerLevelContent } from "@ui/containers";
import { renderHook } from "@testing-library/react-hooks";
import { hookTestBed, TestBedContent } from "@shared/TestBed";

const stubContent = {
  financialVirementEditPartnerLevel: {
    saveButton: {
      content: "stub-saveButton",
    },
    remainingGrantInfo: {
      intro: {
        content: "stub-remainingGrantInfoIntro",
      },
      checkRules: {
        content: "stub-remainingGrantInfoCheckRules",
      },
      remainingGrant: {
        content: "stub-remainingGrantInfoRemainingGrant",
      },
      fundingLevel: {
        content: "stub-remainingGrantInfoFundingLevel",
      },
    },
    labels: {
      partnerName: {
        content: "stub-partnerName",
      },
      partnerOriginalRemainingCosts: {
        content: "stub-partnerOriginalRemainingCosts",
      },
      partnerOriginalRemainingGrant: {
        content: "stub-partnerOriginalRemainingGrant",
      },
      originalFundingLevel: {
        content: "stub-originalFundingLevel",
      },
      partnerNewRemainingCosts: {
        content: "stub-partnerNewRemainingCosts",
      },
      partnerNewRemainingGrant: {
        content: "stub-partnerNewRemainingGrant",
      },
      newFundingLevel: {
        content: "stub-newFundingLevel",
      },
      backToSummary: {
        content: "stub-backToSummary",
      },
      projectTotals: {
        content: "stub-projectTotals",
      },
    },
  },
} as any;

const renderPageContent = () => {
  return renderHook(useEditPartnerLevelContent, hookTestBed({ content: stubContent as TestBedContent }));
};

describe("useEditPartnerLevelContent()", () => {
  test.each`
    name                                  | property
    ${"remainingGrantInfoIntro"}          | ${"intro"}
    ${"remainingGrantInfoCheckRules"}     | ${"checkRules"}
    ${"remainingGrantInfoRemainingGrant"} | ${"remainingGrant"}
    ${"remainingGrantInfoFundingLevel"}   | ${"fundingLevel"}
  `("with $property ", ({ name, property }: Record<"name" | "property", string>) => {
    const { result } = renderPageContent();

    const content = (result.current as any)[name];
    const expectedContent = stubContent.financialVirementEditPartnerLevel.remainingGrantInfo[property].content;

    expect(content).toBe(expectedContent);
  });

  test.each`
    name                               | property
    ${"partnerName"}                   | ${"partnerName"}
    ${"partnerOriginalRemainingCosts"} | ${"partnerOriginalRemainingCosts"}
    ${"partnerOriginalRemainingGrant"} | ${"partnerOriginalRemainingGrant"}
    ${"originalFundingLevel"}          | ${"originalFundingLevel"}
    ${"partnerNewRemainingCosts"}      | ${"partnerNewRemainingCosts"}
    ${"partnerNewRemainingGrant"}      | ${"partnerNewRemainingGrant"}
    ${"newFundingLevel"}               | ${"newFundingLevel"}
    ${"projectTotals"}                 | ${"projectTotals"}
    ${"backToSummary"}                 | ${"backToSummary"}
  `("with $property ", ({ name, property }: Record<"name" | "property", string>) => {
    const { result } = renderPageContent();

    const content = (result.current as any)[name];
    const expectedContent = stubContent.financialVirementEditPartnerLevel.labels[property].content;

    expect(content).toBe(expectedContent);
  });

  test("saveButton content", () => {
    const { result } = renderPageContent();
    const content = result.current.saveButton;

    expect(content).toBe(stubContent.financialVirementEditPartnerLevel.saveButton.content);
  });
});
