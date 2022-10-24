import { renderHook } from "@testing-library/react";

import { useReviewContent } from "@ui/containers";
import { hookTestBed } from "@shared/TestBed";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";
import { ContentProvider } from "@ui/redux";
import { Copy } from "@copy/Copy";

const stubContent = {
  projectLabels: {
    competitionNameLabel: "stub-competitionNameLabel",
    competitionTypeLabel: "stub-competitionTypeLabel",
  },
  documentMessages: {
    uploadInstruction1: "stub-uploadInstruction1",
    uploadInstruction2: "stub-uploadInstruction2",
    noDocumentsUploaded: "stub-noDocumentsUploaded",
  },
  claimsLabels: {
    accordionTitleForecast: "stub-accordionTitleForecast",
    accordionTitleClaimLog: "stub-accordionTitleClaimLog",
  },
  claimsMessages: {
    finalClaim: "stub-finalClaim",
  },
  pages: {
    projectDocuments: {
      noMatchingDocumentsMessage: "stub-noMatchingDocumentsMessage",
      searchDocumentsMessage: "stub-searchDocumentsMessage",
    },
    claimDocuments: {
      descriptionLabel: "stub-descriptionLabel",
    },
    claimReview: {
      backLink: "stub-backLink",
      optionQueryClaim: "stub-optionQueryClaim",
      optionSubmitClaim: "stub-optionSubmitClaim",
      sectionTitleHowToProceed: "stub-sectionTitleHowToProceed",
      sectionTitleAdditionalInfo: "stub-sectionTitleAdditionalInfo",
      additionalInfoHint: "stub-additionalInfoHint",
      claimReviewDeclaration: "stub-claimReviewDeclaration",
      monitoringReportReminder: "stub-monitoringReportReminder",
      buttonSubmit: "stub-buttonSubmit",
      buttonSendQuery: "stub-buttonSendQuery",
      buttonUpload: "stub-buttonUpload",
      labelInputUpload: "stub-labelInputUpload",
      accordionTitleSupportingDocumentsForm: "stub-accordionTitleSupportingDocumentsForm",
      additionalInfo: "stub-additionalInfo",
      additionalInfoHintIfYou: "stub-additionalInfoHintIfYou",
      additionalInfoHintQueryClaim: "stub-additionalInfoHintQueryClaim",
      additionalInfoHintSubmitClaim: "stub-additionalInfoHintSubmitClaim",
    },
  },
};

const renderPageContent = (competitionType?: string) => {
  return renderHook(useReviewContent, hookTestBed({ competitionType }));
};

describe("useReviewContent()", () => {
  beforeAll(async () => {
    await testInitialiseInternationalisation(stubContent);
  });

  test.each`
    name                      | property
    ${"competitionNameLabel"} | ${"competitionNameLabel"}
    ${"competitionTypeLabel"} | ${"competitionTypeLabel"}
  `(
    "with message $property",
    ({ name, property }: { name: string; property: keyof typeof stubContent.pages.claimReview }) => {
      const { result } = renderPageContent();

      const content = (result.current.default as any)[name];
      const expectedContent = stubContent.pages.claimReview[property];

      expect(content).toBe(expectedContent);
    },
  );

  test.each`
    name                                       | property
    ${"backLink"}                              | ${"backLink"}
    ${"optionQueryClaim"}                      | ${"optionQueryClaim"}
    ${"optionSubmitClaim"}                     | ${"optionSubmitClaim"}
    ${"sectionTitleHowToProceed"}              | ${"sectionTitleHowToProceed"}
    ${"sectionTitleAdditionalInfo"}            | ${"sectionTitleAdditionalInfo"}
    ${"additionalInfoHint"}                    | ${"additionalInfoHint"}
    ${"claimReviewDeclaration"}                | ${"claimReviewDeclaration"}
    ${"monitoringReportReminder"}              | ${"monitoringReportReminder"}
    ${"buttonSubmit"}                          | ${"buttonSubmit"}
    ${"buttonSendQuery"}                       | ${"buttonSendQuery"}
    ${"buttonUpload"}                          | ${"buttonUpload"}
    ${"labelInputUpload"}                      | ${"labelInputUpload"}
    ${"accordionTitleSupportingDocumentsForm"} | ${"accordionTitleSupportingDocumentsForm"}
    ${"additionalInfo"}                        | ${"additionalInfo"}
  `("with $property", ({ name, property }: { name: string; property: keyof typeof stubContent.pages.claimReview }) => {
    const { result } = renderPageContent();

    const content = (result.current.default as any)[name];
    const expectedContent = stubContent.pages.claimReview[property];

    expect(content).toBe(expectedContent);
  });

  test.each`
    name            | property
    ${"finalClaim"} | ${"finalClaim"}
  `(
    "with message $property",
    ({ name, property }: { name: string; property: keyof typeof stubContent.claimsMessages }) => {
      const { result } = renderPageContent();

      const content = (result.current.default as any)[name];
      const expectedContent = stubContent.claimsMessages[property];

      expect(content).toBe(expectedContent);
    },
  );

  test.each`
    name                        | property
    ${"accordionTitleForecast"} | ${"accordionTitleForecast"}
    ${"accordionTitleClaimLog"} | ${"accordionTitleClaimLog"}
  `(
    "with labels $property",
    ({ name, property }: { name: string; property: keyof typeof stubContent.claimsLabels }) => {
      const { result } = renderPageContent();

      const content = (result.current.default as any)[name];
      const expectedContent = stubContent.claimsLabels[property];

      expect(content).toBe(expectedContent);
    },
  );

  test.each`
    name                     | property
    ${"uploadInstruction1"}  | ${"uploadInstruction1"}
    ${"uploadInstruction2"}  | ${"uploadInstruction2"}
    ${"noDocumentsUploaded"} | ${"noDocumentsUploaded"}
  `(
    "with documentMessages $property",
    ({ name, property }: { name: string; property: keyof typeof stubContent.documentMessages }) => {
      const { result } = renderPageContent();

      const content = (result.current.default as any)[name];
      const expectedContent = stubContent.documentMessages[property];

      expect(content).toBe(expectedContent);
    },
  );

  test.each`
    name                  | property
    ${"descriptionLabel"} | ${"descriptionLabel"}
  `(
    "with claimDocuments $property",
    ({ name, property }: { name: string; property: keyof typeof stubContent.pages.claimDocuments }) => {
      const { result } = renderPageContent();

      const content = (result.current.default as any)[name];
      const expectedContent = stubContent.pages.claimDocuments[property];

      expect(content).toBe(expectedContent);
    },
  );

  test.each`
    name                            | property
    ${"noMatchingDocumentsMessage"} | ${"noMatchingDocumentsMessage"}
    ${"searchDocumentsMessage"}     | ${"searchDocumentsMessage"}
  `(
    "with projectDocuments $property",
    ({ name, property }: { name: string; property: keyof typeof stubContent.pages.projectDocuments }) => {
      const { result } = renderPageContent();

      const content = (result.current.default as any)[name];
      const expectedContent = stubContent.pages.projectDocuments[property];

      expect(content).toBe(expectedContent);
    },
  );
});

describe("getCompetitionContent()", () => {
  test("with ktp competition type", () => {
    const { result } = renderPageContent();

    const ktpContent = result.current.getCompetitionContent("KTP");

    if (!ktpContent) {
      throw new Error("No KTP content found");
    }

    expect(ktpContent.additionalInfoHintIfYou).toEqual(stubContent.pages.claimReview.additionalInfoHintIfYou);
    expect(ktpContent.additionalInfoHintQueryClaim).toEqual(stubContent.pages.claimReview.additionalInfoHintQueryClaim);
    expect(ktpContent.additionalInfoHintSubmitClaim).toEqual(
      stubContent.pages.claimReview.additionalInfoHintSubmitClaim,
    );
  });

  test("with no matching value", () => {
    const { result } = renderPageContent();

    const fetchOtherContent = result.current.getCompetitionContent("this-should-error");

    expect(fetchOtherContent).toBeUndefined();
  });
});
