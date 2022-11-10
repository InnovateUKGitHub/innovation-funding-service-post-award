import { hookTestBed } from "@shared/TestBed";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";
import { renderHook } from "@testing-library/react";
import { useEditPageContent } from "@ui/containers";

const stubContent = {
  pages: {
    financialVirementEdit: {
      summaryTitle: "stub-summaryTitle",
      saveButton: "stub-saveButton",
      editPageMessage: {
        intro: "stub-introMessage",
        virements: "stub-virementsMessage",
        requests: "stub-requestsMessage",
      },
    },
  },
  financialVirementLabels: {
    costCategoryName: "stub-costCategoryName",
    costCategoryOriginalEligibleCosts: "stub-costCategoryOriginalEligibleCosts",
    costCategoryCostsClaimed: "stub-costCategoryCostsClaimed",
    costCategoryNewEligibleCosts: "stub-costCategoryNewEligibleCosts",
    costCategoryDifferenceCosts: "stub-costCategoryDifferenceCosts",
    partnerTotals: "stub-partnerTotals",
    projectOriginalEligibleCosts: "stub-projectOriginalEligibleCosts",
    projectNewEligibleCosts: "stub-projectNewEligibleCosts",
    projectDifferenceCosts: "stub-projectDifferenceCosts",
    projectOriginalRemainingGrant: "stub-projectOriginalRemainingGrant",
    projectNewRemainingGrant: "stub-projectNewRemainingGrant",
    projectDifferenceGrant: "stub-projectDifferenceGrant",
    backToSummary: "stub-backToSummary",
  },
};

const renderPageContent = () => {
  return renderHook(useEditPageContent, hookTestBed({}));
};

describe("useEditPageContent()", () => {
  beforeAll(async () => {
    await testInitialiseInternationalisation(stubContent);
  });

  test.each`
    name                  | property
    ${"introMessage"}     | ${"intro"}
    ${"virementsMessage"} | ${"virements"}
    ${"requestsMessage"}  | ${"requests"}
  `(
    "with message $property",
    ({
      name,
      property,
    }: {
      name: string;
      property: keyof typeof stubContent.pages.financialVirementEdit.editPageMessage;
    }) => {
      const { result } = renderPageContent();

      const content = (result.current as unknown as Record<string, string>)[name];
      const expectedContent = stubContent.pages.financialVirementEdit.editPageMessage[property];

      expect(content).toBe(expectedContent);
    },
  );

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
  `("with label $property", ({ property }: { property: keyof typeof stubContent.financialVirementLabels }) => {
    const { result } = renderPageContent();

    const content = (result.current as unknown as Record<string, string>)[property];
    const expectedContent = stubContent.financialVirementLabels[property];

    expect(content).toBe(expectedContent);
  });

  describe("useEditPageContent()", () => {
    test.each`
      property
      ${"summaryTitle"}
      ${"saveButton"}
    `("with $property", ({ property }: { property: keyof typeof stubContent.pages.financialVirementEdit }) => {
      const { result } = renderPageContent();

      const content = (result.current as unknown as Record<string, string>)[property];
      const expectedContent = stubContent.pages.financialVirementEdit[property];

      expect(content).toBe(expectedContent);
    });
  });
});
