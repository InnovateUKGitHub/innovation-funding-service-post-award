import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import {
  useClaimDocumentContent,
  ClaimDocumentAdvice,
  ClaimDocumentAdviceProps,
} from "@ui/containers/claims/claimDocuments";
import { hookTestBed, TestBedContent } from "@shared/TestBed";

describe("useClaimDocumentContent()", () => {
  const stubContent = {
    claimDocuments: {
      backLink: { content: "stub-backLink" },
      descriptionLabel: { content: "stub-descriptionLabel" },
      documentsListSectionTitle: { content: "stub-documentsListSectionTitle" },
      saveAndReturnButton: { content: "stub-saveAndReturnButton" },
      saveAndContinueToSummaryButton: { content: "stub-saveAndContinueToSummaryButton" },
      saveAndContinueToForecastButton: { content: "stub-saveAndContinueToForecastButton" },
      messages: {
        iarRequired: { content: "stub-iarRequired" },
        iarRequiredAdvice: { content: "stub-iarRequiredAdvice" },
        finalClaimIarAdvice: { content: "stub-finalClaimIarAdvice" },
        finalClaimNonIarAdvice: { content: "stub-finalClaimNonIarAdvice" },
        usefulTip: { content: "stub-usefulTip" },
        requiredUploadAdvice: { content: "stub-requiredUploadAdvice" },
        requiredUploadStep1: { content: "stub-requiredUploadStep1" },
        requiredUploadStep2: { content: "stub-requiredUploadStep2" },
        finalClaimMessage: { content: "stub-finalClaimMessage" },
        finalClaimGuidanceParagraph1: { content: "stub-finalClaimGuidanceParagraph1" },
        finalClaimGuidanceParagraph2: { content: "stub-finalClaimGuidanceParagraph2" },
        finalClaimStep1: { content: "stub-finalClaimStep1" },
        finalClaimStep2: { content: "stub-finalClaimStep2" },
        finalClaimStep3: { content: "stub-finalClaimStep3" },
      },
      documentMessages: {
        uploadTitle: { content: "stub-uploadTitle" },
        uploadDocumentsLabel: { content: "stub-uploadDocumentsLabel" },
        noDocumentsUploaded: { content: "stub-noDocumentsUploaded" },
        newWindow: { content: "stub-newWindow" },
      },
    },
  } as any;

  const renderPageContent = () => {
    return renderHook(useClaimDocumentContent, hookTestBed({ content: stubContent as TestBedContent }));
  };

  test.each`
    name                                 | property
    ${"backLink"}                        | ${"backLink"}
    ${"descriptionLabel"}                | ${"descriptionLabel"}
    ${"documentsListSectionTitle"}       | ${"documentsListSectionTitle"}
    ${"saveAndReturnButton"}             | ${"saveAndReturnButton"}
    ${"saveAndContinueToSummaryButton"}  | ${"saveAndContinueToSummaryButton"}
    ${"saveAndContinueToForecastButton"} | ${"saveAndContinueToForecastButton"}
  `("with $property", ({ name, property }: Record<"name" | "property", string>) => {
    const { result } = renderPageContent();

    const content = (result.current as any)[name];
    const expectedContent = stubContent.claimDocuments[property].content;

    expect(content).toBe(expectedContent);
  });

  test.each`
    name                              | property
    ${"iarRequired"}                  | ${"iarRequired"}
    ${"iarRequiredAdvice"}            | ${"iarRequiredAdvice"}
    ${"finalClaimIarAdvice"}          | ${"finalClaimIarAdvice"}
    ${"finalClaimNonIarAdvice"}       | ${"finalClaimNonIarAdvice"}
    ${"usefulTip"}                    | ${"usefulTip"}
    ${"requiredUploadAdvice"}         | ${"requiredUploadAdvice"}
    ${"requiredUploadStep1"}          | ${"requiredUploadStep1"}
    ${"requiredUploadStep2"}          | ${"requiredUploadStep2"}
    ${"finalClaimMessage"}            | ${"finalClaimMessage"}
    ${"finalClaimGuidanceParagraph1"} | ${"finalClaimGuidanceParagraph1"}
    ${"finalClaimGuidanceParagraph2"} | ${"finalClaimGuidanceParagraph2"}
    ${"finalClaimStep1"}              | ${"finalClaimStep1"}
    ${"finalClaimStep2"}              | ${"finalClaimStep2"}
    ${"finalClaimStep3"}              | ${"finalClaimStep3"}
  `("with $property", ({ name, property }: Record<"name" | "property", string>) => {
    const { result } = renderPageContent();

    const content = (result.current as any)[name];
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

    const content = (result.current as any)[name];
    const expectedContent = stubContent.claimDocuments.documentMessages[property].content;

    expect(content).toBe(expectedContent);
  });
});

describe("<ClaimDocumentAdvice />", () => {
  const stubContent: ClaimDocumentAdviceProps["content"] = {
    iarRequiredAdvice: "stub-iarRequiredAdvice",
    finalClaimIarAdvice: "stub-finalClaimIarAdvice",
    usefulTip: "stub-usefulTip",
    requiredUploadAdvice: "stub-requiredUploadAdvice",
    requiredUploadStep1: "stub-requiredUploadStep1",
    requiredUploadStep2: "stub-requiredUploadStep2",
    finalClaimGuidanceParagraph1: "stub-finalClaimGuidanceParagraph1",
    finalClaimGuidanceParagraph2: "stub-finalClaimGuidanceParagraph2",
    finalClaimStep1: "stub-finalClaimStep1",
    finalClaimStep2: "stub-finalClaimStep2",
    finalClaimStep3: "stub-finalClaimStep3",
    iarRequired: "stub-iarRequired",
  };

  const setup = (props: ClaimDocumentAdviceProps) => render(<ClaimDocumentAdvice {...props} />);

  describe("@renders", () => {
    describe("with fallback content", () => {
      test("with no content", () => {
        const { container } = setup({
          competitionType: "no-matching-value",
          isIarRequired: false,
          isFinalClaim: false,
          content: stubContent,
        });

        expect(container.firstChild).toBe(null);
      });

      test("when iar is required and final claim is false", () => {
        const { queryByText } = setup({
          competitionType: "no-matching-value",
          isIarRequired: true,
          isFinalClaim: false,
          content: stubContent,
        });

        expect(queryByText(stubContent.iarRequired)).toBeInTheDocument();
      });

      test("when iar is required and final claim is true", () => {
        const { queryByText } = setup({
          competitionType: "no-matching-value",
          isIarRequired: true,
          isFinalClaim: true,
          content: stubContent,
        });

        expect(queryByText(stubContent.finalClaimGuidanceParagraph1)).toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimGuidanceParagraph2)).toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimStep1)).toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimStep2)).toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimStep3)).toBeInTheDocument();
      });
    });

    describe("with ktp content", () => {
      test("when iar is required and final claim is false", () => {
        const { queryByText } = setup({
          competitionType: "KTP",
          isIarRequired: true,
          isFinalClaim: false,
          content: stubContent,
        });

        expect(queryByText(stubContent.iarRequiredAdvice)).toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimIarAdvice)).not.toBeInTheDocument();

        expect(queryByText(stubContent.usefulTip)).toBeInTheDocument();
        expect(queryByText(stubContent.requiredUploadAdvice)).toBeInTheDocument();
        expect(queryByText(stubContent.requiredUploadStep1)).toBeInTheDocument();
        expect(queryByText(stubContent.requiredUploadStep2)).toBeInTheDocument();
      });

      test("when iar is required and final claim is true", () => {
        const { queryByText } = setup({
          competitionType: "KTP",
          isIarRequired: true,
          isFinalClaim: true,
          content: stubContent,
        });

        expect(queryByText(stubContent.iarRequiredAdvice)).toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimIarAdvice)).toBeInTheDocument();

        expect(queryByText(stubContent.usefulTip)).toBeInTheDocument();
        expect(queryByText(stubContent.requiredUploadAdvice)).toBeInTheDocument();
        expect(queryByText(stubContent.requiredUploadStep1)).toBeInTheDocument();
        expect(queryByText(stubContent.requiredUploadStep2)).toBeInTheDocument();
      });

      test("when iar is not required and final claim is false", () => {
        const { queryByText } = setup({
          competitionType: "KTP",
          isIarRequired: false,
          isFinalClaim: false,
          content: stubContent,
        });

        expect(queryByText(stubContent.iarRequiredAdvice)).not.toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimIarAdvice)).not.toBeInTheDocument();

        expect(queryByText(stubContent.usefulTip)).toBeInTheDocument();
        expect(queryByText(stubContent.requiredUploadAdvice)).toBeInTheDocument();
        expect(queryByText(stubContent.requiredUploadStep1)).toBeInTheDocument();
        expect(queryByText(stubContent.requiredUploadStep2)).toBeInTheDocument();
      });

      test("when iar is not required and final claim is true", () => {
        const { queryByText } = setup({
          competitionType: "KTP",
          isIarRequired: false,
          isFinalClaim: true,
          content: stubContent,
        });

        expect(queryByText(stubContent.iarRequiredAdvice)).not.toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimIarAdvice)).toBeInTheDocument();

        expect(queryByText(stubContent.usefulTip)).toBeInTheDocument();
        expect(queryByText(stubContent.requiredUploadAdvice)).toBeInTheDocument();
        expect(queryByText(stubContent.requiredUploadStep1)).toBeInTheDocument();
        expect(queryByText(stubContent.requiredUploadStep2)).toBeInTheDocument();
      });
    });
  });
});
