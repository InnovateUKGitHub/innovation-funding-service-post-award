import { renderHook } from "@testing-library/react";

import { useReviewContent } from "@ui/containers";
import { hookTestBed, TestBedContent } from "@shared/TestBed";

const stubContent = {
  projectDetails: {
    projectLabels: {
      competitionNameLabel: { content: "stub-competitionNameLabel" },
      competitionTypeLabel: { content: "stub-competitionTypeLabel" },
    },
  },
  claimReview: {
    additionalInfoHint: { content: "stub-additionalInfoHint" },
    backLink: { content: "stub-backLink" },
    queryClaimOption: { content: "stub-queryClaimOption" },
    approveClaimOption: { content: "stub-approveClaimOption" },
    howToProceedSectionTitle: { content: "stub-howToProceedSectionTitle" },
    submitButton: { content: "stub-submitButton" },
    sendQueryButton: { content: "stub-sendQueryButton" },
    uploadSupportingDocumentsFormAccordionTitle: { content: "stub-uploadSupportingDocumentsFormAccordionTitle" },
    uploadInputLabel: { content: "stub-uploadInputLabel" },
    uploadButton: { content: "stub-uploadButton" },
    claimReviewDeclaration: { content: "stub-claimReviewDeclaration" },
    monitoringReportReminder: { content: "stub-monitoringReportReminder" },
    additionalInfoSectionTitle: { content: "stub-additionalInfoSectionTitle" },
    additionalInfoLabel: { content: "stub-additionalInfoLabel" },
    additionalInfoHintIfYou: { content: "stub-additionalInfoHintIfYou" },
    additionalInfoHintQueryClaim: { content: "stub-additionalInfoHintQueryClaim" },
    additionalInfoHintSubmitClaim: { content: "stub-additionalInfoHintSubmitClaim" },
    labels: {
      forecastAccordionTitle: { content: "stub-forecastAccordionTitle" },
      claimLogAccordionTitle: { content: "stub-claimLogAccordionTitle" },
    },
    documentMessages: {
      uploadInstruction1: { content: "stub-uploadInstruction1" },
      uploadInstruction2: { content: "stub-uploadInstruction2" },
      noDocumentsUploaded: { content: "stub-noDocumentsUploaded" },
    },
    messages: {
      finalClaimMessage: { content: "stub-finalClaimMessage" },
    },
  },
  claimDocuments: {
    descriptionLabel: { content: "stub-descriptionLabel" },
  },
  projectDocuments: {
    noMatchingDocumentsMessage: { content: "stub-noMatchingDocumentsMessage" },
    searchDocumentsMessage: { content: "stub-searchDocumentsMessage" },
  },
} as any;

const renderPageContent = () => {
  return renderHook(useReviewContent, hookTestBed({ content: stubContent as TestBedContent }));
};

describe("useReviewContent()", () => {
  test.each`
    name                      | property
    ${"competitionNameLabel"} | ${"competitionNameLabel"}
    ${"competitionTypeLabel"} | ${"competitionTypeLabel"}
  `("with message $property", ({ name, property }: Record<"name" | "property", string>) => {
    const { result } = renderPageContent();

    const content = (result.current.default as any)[name];
    const expectedContent = stubContent.projectDetails.projectLabels[property].content;

    expect(content).toBe(expectedContent);
  });

  test.each`
    name                                             | property
    ${"additionalInfoHint"}                          | ${"additionalInfoHint"}
    ${"backlinkMessage"}                             | ${"backLink"}
    ${"queryClaimOption"}                            | ${"queryClaimOption"}
    ${"approveClaimOption"}                          | ${"approveClaimOption"}
    ${"howToProceedSectionTitle"}                    | ${"howToProceedSectionTitle"}
    ${"submitButton"}                                | ${"submitButton"}
    ${"sendQueryButton"}                             | ${"sendQueryButton"}
    ${"uploadSupportingDocumentsFormAccordionTitle"} | ${"uploadSupportingDocumentsFormAccordionTitle"}
    ${"uploadInputLabel"}                            | ${"uploadInputLabel"}
    ${"uploadButton"}                                | ${"uploadButton"}
    ${"claimReviewDeclaration"}                      | ${"claimReviewDeclaration"}
    ${"monitoringReportReminder"}                    | ${"monitoringReportReminder"}
    ${"additionalInfoSectionTitle"}                  | ${"additionalInfoSectionTitle"}
    ${"additionalInfoLabel"}                         | ${"additionalInfoLabel"}
  `("with $property ", ({ name, property }: Record<"name" | "property", string>) => {
    const { result } = renderPageContent();

    const content = (result.current.default as any)[name];
    const expectedContent = stubContent.claimReview[property].content;

    expect(content).toBe(expectedContent);
  });

  test.each`
    name                   | property
    ${"finalClaimMessage"} | ${"finalClaimMessage"}
  `("with message $property", ({ name, property }: Record<"name" | "property", string>) => {
    const { result } = renderPageContent();

    const content = (result.current.default as any)[name];
    const expectedContent = stubContent.claimReview.messages[property].content;

    expect(content).toBe(expectedContent);
  });

  test.each`
    name                   | property
    ${"forecastItemTitle"} | ${"forecastAccordionTitle"}
    ${"logItemTitle"}      | ${"claimLogAccordionTitle"}
  `("with labels $property", ({ name, property }: Record<"name" | "property", string>) => {
    const { result } = renderPageContent();

    const content = (result.current.default as any)[name];
    const expectedContent = stubContent.claimReview.labels[property].content;

    expect(content).toBe(expectedContent);
  });

  test.each`
    name                     | property
    ${"uploadInstruction1"}  | ${"uploadInstruction1"}
    ${"uploadInstruction2"}  | ${"uploadInstruction2"}
    ${"noDocumentsUploaded"} | ${"noDocumentsUploaded"}
  `("with documentMessages $property", ({ name, property }: Record<"name" | "property", string>) => {
    const { result } = renderPageContent();

    const content = (result.current.default as any)[name];
    const expectedContent = stubContent.claimReview.documentMessages[property].content;

    expect(content).toBe(expectedContent);
  });

  test.each`
    name                  | property
    ${"descriptionLabel"} | ${"descriptionLabel"}
  `("with claimDocuments $property ", ({ name, property }: Record<"name" | "property", string>) => {
    const { result } = renderPageContent();

    const content = (result.current.default as any)[name];
    const expectedContent = stubContent.claimDocuments[property].content;

    expect(content).toBe(expectedContent);
  });

  test.each`
    name                            | property
    ${"noMatchingDocumentsMessage"} | ${"noMatchingDocumentsMessage"}
    ${"searchDocumentsMessage"}     | ${"searchDocumentsMessage"}
  `("with projectDocuments $property ", ({ name, property }: Record<"name" | "property", string>) => {
    const { result } = renderPageContent();

    const content = (result.current.default as any)[name];
    const expectedContent = stubContent.projectDocuments[property].content;

    expect(content).toBe(expectedContent);
  });
});

describe("getCompetitionContent()", () => {
  test("with ktp competition type", () => {
    const { result } = renderPageContent();

    const ktpContent = result.current.getCompetitionContent("KTP");

    if (!ktpContent) {
      throw new Error("No KTP content found");
    }

    expect(ktpContent.additionalInfoHintIfYou).toEqual(stubContent.claimReview.additionalInfoHintIfYou.content);
    expect(ktpContent.additionalInfoHintQueryClaim).toEqual(
      stubContent.claimReview.additionalInfoHintQueryClaim.content,
    );
    expect(ktpContent.additionalInfoHintSubmitClaim).toEqual(
      stubContent.claimReview.additionalInfoHintSubmitClaim.content,
    );
  });

  test("with no matching value", () => {
    const { result } = renderPageContent();

    const fetchOtherContent = result.current.getCompetitionContent("this-should-error");

    expect(fetchOtherContent).toBeUndefined();
  });
});
