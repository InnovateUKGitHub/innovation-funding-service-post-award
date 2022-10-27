import { renderHook } from "@testing-library/react";

import { useReviewContent } from "@ui/containers";
import { hookTestBed } from "@shared/TestBed";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";
import { CopyNamespaces } from "@copy/data";

const stubContent = {
  projectLabels: {
    competitionNameLabel: "stub-competitionNameLabel",
    competitionTypeLabel: "stub-competitionTypeLabel",
  },
  documentMessages: {
    uploadInstruction: "stub-uploadInstruction",
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
    },
  },
};

const ktpContent = {
  pages: {
    claimReview: {
      additionalInfoHint: "stub-ktp-additionalInfoHint",
    },
  },
};

const renderPageContent = (competitionType?: string) => {
  return renderHook(useReviewContent, hookTestBed({ competitionType }));
};

describe("useReviewContent()", () => {
  beforeAll(async () => {
    await testInitialiseInternationalisation(stubContent, { [CopyNamespaces.KTP]: ktpContent });
  });

  test.each`
    name                      | property
    ${"competitionNameLabel"} | ${"competitionNameLabel"}
    ${"competitionTypeLabel"} | ${"competitionTypeLabel"}
  `(
    "with message $property",
    ({ name, property }: { name: string; property: keyof typeof stubContent.pages.claimReview }) => {
      const { result } = renderPageContent();

      const content = (result.current as any)[name];
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

    const content = (result.current as any)[name];
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

      const content = (result.current as any)[name];
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

      const content = (result.current as any)[name];
      const expectedContent = stubContent.claimsLabels[property];

      expect(content).toBe(expectedContent);
    },
  );

  test("with documentMessages", () => {
    const { result } = renderPageContent();

    expect(result.current.noDocumentsUploaded).toBe(stubContent.documentMessages.noDocumentsUploaded);
    expect(result.current.uploadInstruction).toBe(stubContent.documentMessages.uploadInstruction);
  });

  test.each`
    name                  | property
    ${"descriptionLabel"} | ${"descriptionLabel"}
  `(
    "with claimDocuments $property",
    ({ name, property }: { name: string; property: keyof typeof stubContent.pages.claimDocuments }) => {
      const { result } = renderPageContent();

      const content = (result.current as any)[name];
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

      const content = (result.current as any)[name];
      const expectedContent = stubContent.pages.projectDocuments[property];

      expect(content).toBe(expectedContent);
    },
  );

  test("with ktp competition type", () => {
    const { result } = renderPageContent(CopyNamespaces.KTP);

    expect(result.current.additionalInfoHint).toEqual(ktpContent.pages.claimReview.additionalInfoHint);
  });
});
