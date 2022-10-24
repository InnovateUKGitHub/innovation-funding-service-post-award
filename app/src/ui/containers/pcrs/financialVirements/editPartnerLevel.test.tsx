import { useEditPartnerLevelContent } from "@ui/containers";
import { renderHook } from "@testing-library/react";
import { hookTestBed } from "@shared/TestBed";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

const stubContent = {
  pages: {
    financialVirementEditPartnerLevel: {
      saveButton: "stub-saveButton",
      remainingGrantInfo: {
        intro: "stub-remainingGrantInfoIntro",
        checkRules: "stub-remainingGrantInfoCheckRules",
        remainingGrant: "stub-remainingGrantInfoRemainingGrant",
        fundingLevel: "stub-remainingGrantInfoFundingLevel",
      },
    },
  },
  financialVirementLabels: {
    partnerName: "stub-partnerName",
    partnerOriginalRemainingCosts: "stub-partnerOriginalRemainingCosts",
    partnerOriginalRemainingGrant: "stub-partnerOriginalRemainingGrant",
    originalFundingLevel: "stub-originalFundingLevel",
    partnerNewRemainingCosts: "stub-partnerNewRemainingCosts",
    partnerNewRemainingGrant: "stub-partnerNewRemainingGrant",
    newFundingLevel: "stub-newFundingLevel",
    backToSummary: "stub-backToSummary",
    projectTotals: "stub-projectTotals",
  },
};

const renderPageContent = () => {
  return renderHook(useEditPartnerLevelContent, hookTestBed({}));
};

describe("useEditPartnerLevelContent()", () => {
  beforeAll(async () => {
    await testInitialiseInternationalisation(stubContent);
  });

  test.each`
    name                                  | property
    ${"remainingGrantInfoIntro"}          | ${"intro"}
    ${"remainingGrantInfoCheckRules"}     | ${"checkRules"}
    ${"remainingGrantInfoRemainingGrant"} | ${"remainingGrant"}
    ${"remainingGrantInfoFundingLevel"}   | ${"fundingLevel"}
  `(
    "with $property",
    ({
      name,
      property,
    }: {
      name: string;
      property: keyof typeof stubContent.pages.financialVirementEditPartnerLevel.remainingGrantInfo;
    }) => {
      const { result } = renderPageContent();

      const content = (result.current as any)[name];
      const expectedContent = stubContent.pages.financialVirementEditPartnerLevel.remainingGrantInfo[property];

      expect(content).toBe(expectedContent);
    },
  );

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
  `(
    "with $property",
    ({ name, property }: { name: string; property: keyof typeof stubContent.financialVirementLabels }) => {
      const { result } = renderPageContent();

      const content = (result.current as any)[name];
      const expectedContent = stubContent.financialVirementLabels[property];

      expect(content).toBe(expectedContent);
    },
  );

  test("saveButton content", () => {
    const { result } = renderPageContent();
    const content = result.current.saveButton;

    expect(content).toBe(stubContent.pages.financialVirementEditPartnerLevel.saveButton);
  });
});
