import { renderHook } from "@testing-library/react-hooks";

import { useClaimDocumentContent } from "@ui/containers";
import { hookTestBed, TestBedContent } from "@shared/TestBed";

const stubContent = {
  claimDocuments: {
    backLink: {
      content: "stub-backLink",
    },
    descriptionLabel: {
      content: "stub-descriptionLabel",
    },
    documentsListSectionTitle: {
      content: "stub-documentsListSectionTitle",
    },
    saveAndReturnButton: {
      content: "stub-saveAndReturnButton",
    },
    saveAndContinueToSummaryButton: {
      content: "stub-saveAndContinueToSummaryButton",
    },
    saveAndContinueToForecastButton: {
      content: "stub-saveAndContinueToForecastButton",
    },
    lmcMinutesMessage: {
      content: "stub-lmcMinutesMessage",
    },
    virtualApprovalMessage: {
      content: "stub-virtualApprovalMessage",
    },
    introMessage: {
      uploadAndStoreMessage: {
        content: "stub-uploadAndStoreMessage",
      },
      uploadGuidanceMessage: {
        content: "stub-uploadGuidanceMessage",
      },
      schedule3ReminderMessage: {
        content: "stub-schedule3ReminderMessage",
      },
    },
    documentMessages: {
      uploadTitle: {
        content: "stub-uploadTitle",
      },
      uploadDocumentsLabel: {
        content: "stub-uploadDocumentsLabel",
      },
      noDocumentsUploaded: {
        content: "stub-noDocumentsUploaded",
      },
      newWindow: {
        content: "stub-newWindow",
      },
    },
    messages: {
      finalClaim: {
        content: "stub-finalClaim",
      },
      finalClaimGuidance: {
        content: "stub-finalClaimGuidance",
      },
      iarRequired: {
        content: "stub-iarRequired",
      },
    },
  },
} as any;

const renderPageContent = () => {
  return renderHook(useClaimDocumentContent, hookTestBed({ content: stubContent as TestBedContent }));
};

describe("useClaimDocumentContent()", () => {
  test.each`
    name                                 | property
    ${"backLink"}                        | ${"backLink"}
    ${"descriptionLabel"}                | ${"descriptionLabel"}
    ${"documentsListSectionTitle"}       | ${"documentsListSectionTitle"}
    ${"saveAndReturnButton"}             | ${"saveAndReturnButton"}
    ${"saveAndContinueToSummaryButton"}  | ${"saveAndContinueToSummaryButton"}
    ${"saveAndContinueToForecastButton"} | ${"saveAndContinueToForecastButton"}
  `("with $property ", ({ name, property }: Record<"name" | "property", string>) => {
    const { result } = renderPageContent();

    const content = (result.current.default as any)[name];
    const expectedContent = stubContent.claimDocuments[property].content;

    expect(content).toBe(expectedContent);
  });

  test.each`
    name                    | property
    ${"finalClaim"}         | ${"finalClaim"}
    ${"finalClaimGuidance"} | ${"finalClaimGuidance"}
    ${"iarRequired"}        | ${"iarRequired"}
  `("with $property", ({ name, property }: Record<"name" | "property", string>) => {
    const { result } = renderPageContent();

    const content = (result.current.default as any)[name];
    const expectedContent = stubContent.claimDocuments.messages[property].content;

    expect(content).toBe(expectedContent);
  });

  test.each`
    name                      | property
    ${"uploadTitle"}          | ${"uploadTitle"}
    ${"uploadDocumentsLabel"} | ${"uploadDocumentsLabel"}
    ${"noDocumentsUploaded"}  | ${"noDocumentsUploaded"}
    ${"newWindow"}            | ${"newWindow"}
  `("with $property", ({ name, property }: Record<"name" | "property", string>) => {
    const { result } = renderPageContent();

    const content = (result.current.default as any)[name];
    const expectedContent = stubContent.claimDocuments.documentMessages[property].content;

    expect(content).toBe(expectedContent);
  });
});

describe("getCompetitionContent()", () => {
  test("with KTP competition type", () => {
    const { result } = renderPageContent();

    const ktpContent = result.current.getCompetitionContent("KTP");

    if (!ktpContent) {
      throw new Error("No KTP content found");
    }

    expect(ktpContent.uploadAndStoreMessage).toEqual(stubContent.claimDocuments.introMessage.uploadAndStoreMessage.content);
    expect(ktpContent.uploadGuidanceMessage).toEqual(stubContent.claimDocuments.introMessage.uploadGuidanceMessage.content);
    expect(ktpContent.schedule3ReminderMessage).toEqual(stubContent.claimDocuments.introMessage.schedule3ReminderMessage.content);
    expect(ktpContent.lmcMinutesMessage).toEqual(stubContent.claimDocuments.lmcMinutesMessage.content);
    expect(ktpContent.virtualApprovalMessage).toEqual(stubContent.claimDocuments.virtualApprovalMessage.content);
  });

  test("with no matching value", () => {
    const { result } = renderPageContent();

    const fetchOtherContent = result.current.getCompetitionContent("this-should-error");

    expect(fetchOtherContent).toBeUndefined();
  });
});
