import React from "react";

import { useEditPageContent, useEditPartnerLevelContent } from "@ui/containers";
import { renderHook } from "@testing-library/react-hooks";
import { hookTestBed, TestBedContent } from "@shared/TestBed";

const stubContent = {
  financialVirementEdit: {
    summaryTitle: {
      content: "stub-summaryTitle",
    },
    saveButton: {
      content: "stub-saveButton",
    },
    editPageMessage: {
      intro: {
        content: "stub-introMessage",
      },
      virements: {
        content: "stub-virementsMessage",
      },
      requests: {
        content: "stub-requestsMessage",
      },
    },
    labels: {
      costCategoryName: {
        content: "stub-costCategoryName",
      },
      costCategoryOriginalEligibleCosts: {
        content: "stub-costCategoryOriginalEligibleCosts",
      },
      costCategoryCostsClaimed: {
        content: "stub-costCategoryCostsClaimed",
      },
      costCategoryNewEligibleCosts: {
        content: "stub-costCategoryNewEligibleCosts",
      },
      costCategoryDifferenceCosts: {
        content: "stub-costCategoryDifferenceCosts",
      },
      partnerTotals: {
        content: "stub-partnerTotals",
      },
      projectOriginalEligibleCosts: {
        content: "stub-projectOriginalEligibleCosts",
      },
      projectNewEligibleCosts: {
        content: "stub-projectNewEligibleCosts",
      },
      projectDifferenceCosts: {
        content: "stub-projectDifferenceCosts",
      },
      projectOriginalRemainingGrant: {
        content: "stub-projectOriginalRemainingGrant",
      },
      projectNewRemainingGrant: {
        content: "stub-projectNewRemainingGrant",
      },
      projectDifferenceGrant: {
        content: "stub-projectDifferenceGrant",
      },
      backToSummary: {
        content: "stub-backToSummary",
      },
    },
  },
} as any;

const renderPageContent = () => {
  return renderHook(useEditPageContent, hookTestBed({ content: stubContent as TestBedContent }));
};

describe("useEditPageContent()", () => {
  test.each`
    name                  | property
    ${"introMessage"}     | ${"intro"}
    ${"virementsMessage"} | ${"virements"}
    ${"requestsMessage"}  | ${"requests"}
  `("with message $property ", ({ name, property }: Record<"name" | "property", string>) => {
    const { result } = renderPageContent();

    const content = (result.current as any)[name];
    const expectedContent = stubContent.financialVirementEdit.editPageMessage[property].content;

    expect(content).toBe(expectedContent);
  });

  test.each`
    property
    ${"costCategoryName"}
    ${"costCategoryOriginalEligibleCosts"}
    ${"costCategoryCostsClaimed"}
    ${"costCategoryNewEligibleCosts"}
    ${"costCategoryDifferenceCosts"}
    ${"partnerTotals"}
    ${"projectOriginalEligibleCosts"}
    ${"projectDifferenceCosts"}
    ${"projectOriginalRemainingGrant"}
    ${"projectNewRemainingGrant"}
    ${"projectDifferenceGrant"}
    ${"backToSummary"}
  `("with label $property ", ({ property }) => {
    const { result } = renderPageContent();

    const content = (result.current as any)[property];
    const expectedContent = stubContent.financialVirementEdit.labels[property].content;

    expect(content).toBe(expectedContent);
  });

  describe("useEditPageContent()", () => {
    test.each`
      property
      ${"summaryTitle"}
      ${"saveButton"}
    `("with $property ", ({ property }) => {
      const { result } = renderPageContent();

      const content = (result.current as any)[property];
      const expectedContent = stubContent.financialVirementEdit[property].content;

      expect(content).toBe(expectedContent);
    });
  });
});
