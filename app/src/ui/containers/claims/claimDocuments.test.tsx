import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react";

import {
  useClaimDocumentContent,
  ClaimDocumentAdvice,
  ClaimDocumentAdviceProps,
} from "@ui/containers/claims/claimDocuments.page";
import { hookTestBed } from "@shared/TestBed";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("useClaimDocumentContent()", () => {
  const stubContent = {
    documentLabels: {
      documentDisplayTitle: "stub-documentDisplayTitle",
      documentDisplaySubTitle: "stub-documentDisplaySubTitle",
    },
    documentMessages: {
      uploadTitle: "stub-uploadTitle",
      uploadDocuments: "stub-uploadDocumentsLabel",
      noDocumentsUploaded: "stub-noDocumentsUploaded",
    },
    pages: {
      claimDocuments: {
        backLink: "stub-backLink",
        descriptionLabel: "stub-descriptionLabel",
        documentsListSectionTitle: "stub-documentsListSectionTitle",
        buttonSaveAndReturn: "stub-buttonSaveAndReturn",
        buttonSaveAndContinueToSummary: "stub-buttonSaveAndContinueToSummary",
        buttonSaveAndContinueToForecast: "stub-buttonSaveAndContinueToForecast",
      },
    },
    claimsMessages: {
      iarRequired: "stub-iarRequired",
      iarRequiredPara2: "stub-iarRequired-para-2",
      iarRequiredAdvice: "stub-iarRequiredAdvice",
      finalClaimIarAdvice: "stub-finalClaimIarAdvice",
      finalClaimNonIarAdvice: "stub-finalClaimNonIarAdvice",
      usefulTip: "stub-usefulTip",
      requiredUploadAdvice: "stub-requiredUploadAdvice",
      requiredUploadStep1: "stub-requiredUploadStep1",
      requiredUploadStep2: "stub-requiredUploadStep2",
      finalClaim: "stub-finalClaim",
      finalClaimGuidanceContent1: "stub-finalClaimGuidanceContent1",
      finalClaimStep1: "stub-finalClaimStep1",
      finalClaimStep2: "stub-finalClaimStep2",
      sbriDocumentAdvice: "stub-sbriInvoice",
      sbriInvoiceBullet1: "stub-sbriInvoice-bullet-1",
      sbriInvoiceBullet2: "stub-sbriInvoice-bullet-2",
      sbriInvoiceBullet3: "stub-sbriInvoice-bullet-3",
      sbriMoAdvice: "stub-sbriInvoice2",
    },
  };

  const renderPageContent = () => {
    return renderHook(useClaimDocumentContent, hookTestBed({}));
  };

  beforeAll(async () => {
    testInitialiseInternationalisation(stubContent);
  });

  test.each`
    name                                 | property
    ${"backLink"}                        | ${"backLink"}
    ${"descriptionLabel"}                | ${"descriptionLabel"}
    ${"buttonSaveAndReturn"}             | ${"buttonSaveAndReturn"}
    ${"buttonSaveAndContinueToSummary"}  | ${"buttonSaveAndContinueToSummary"}
    ${"buttonSaveAndContinueToForecast"} | ${"buttonSaveAndContinueToForecast"}
  `(
    "with $property",
    ({ name, property }: { name: string; property: keyof typeof stubContent.pages.claimDocuments }) => {
      const { result } = renderPageContent();

      const content = (result.current as any)[name];
      const expectedContent = stubContent.pages.claimDocuments[property];

      expect(content).toBe(expectedContent);
    },
  );

  test.each`
    name                            | property
    ${"iarRequired"}                | ${"iarRequired"}
    ${"iarRequiredAdvice"}          | ${"iarRequiredAdvice"}
    ${"finalClaimIarAdvice"}        | ${"finalClaimIarAdvice"}
    ${"finalClaimNonIarAdvice"}     | ${"finalClaimNonIarAdvice"}
    ${"usefulTip"}                  | ${"usefulTip"}
    ${"requiredUploadAdvice"}       | ${"requiredUploadAdvice"}
    ${"requiredUploadStep1"}        | ${"requiredUploadStep1"}
    ${"requiredUploadStep2"}        | ${"requiredUploadStep2"}
    ${"finalClaim"}                 | ${"finalClaim"}
    ${"finalClaimGuidanceContent1"} | ${"finalClaimGuidanceContent1"}
    ${"finalClaimStep1"}            | ${"finalClaimStep1"}
    ${"finalClaimStep2"}            | ${"finalClaimStep2"}
  `("with $property", ({ name, property }: { name: string; property: keyof typeof stubContent.claimsMessages }) => {
    const { result } = renderPageContent();

    const content = (result.current as any)[name];
    const expectedContent = stubContent.claimsMessages[property];

    expect(content).toBe(expectedContent);
  });

  test.each`
    name                     | property
    ${"uploadTitle"}         | ${"uploadTitle"}
    ${"uploadDocuments"}     | ${"uploadDocuments"}
    ${"noDocumentsUploaded"} | ${"noDocumentsUploaded"}
  `("with $property", ({ name, property }: { name: string; property: keyof typeof stubContent.documentMessages }) => {
    const { result } = renderPageContent();

    const content = (result.current as any)[name];
    const expectedContent = stubContent.documentMessages[property];

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
    finalClaimGuidanceContent1: "stub-finalClaimGuidanceContent1",
    finalClaimStep1: "stub-finalClaimStep1",
    finalClaimStep2: "stub-finalClaimStep2",
    iarRequired: "stub-iarRequired",
    iarRequiredPara2: "stub-iarRequiredPara2",
    sbriDocumentAdvice: "stub-sbriInvoice",
    sbriInvoiceBullet1: "stub-sbriInvoice-bullet-1",
    sbriInvoiceBullet2: "stub-sbriInvoice-bullet-2",
    sbriInvoiceBullet3: "stub-sbriInvoice-bullet-3",
    sbriMoAdvice: "stub-sbriInvoice2",
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

        expect(queryByText(stubContent.finalClaimGuidanceContent1)).toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimStep1)).toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimStep2)).toBeInTheDocument();
        expect(queryByText(stubContent.iarRequired)).toBeInTheDocument();
      });

      test("when iar is not required and final claim is true", () => {
        const { queryByText } = setup({
          competitionType: "no-matching-value",
          isIarRequired: false,
          isFinalClaim: true,
          content: stubContent,
        });

        expect(queryByText(stubContent.finalClaimGuidanceContent1)).toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimStep1)).toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimStep2)).toBeInTheDocument();
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

    describe("with sbri content", () => {
      test("when iar is required and final claim is true", () => {
        const { queryByText } = setup({
          competitionType: "SBRI",
          isIarRequired: true,
          isFinalClaim: true,
          content: stubContent,
        });

        expect(queryByText(stubContent.finalClaimGuidanceContent1)).toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimStep1)).toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimStep2)).toBeInTheDocument();

        expect(queryByText(stubContent.iarRequired)).toBeInTheDocument();

        expect(queryByText(stubContent.sbriDocumentAdvice)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriInvoiceBullet1)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriInvoiceBullet2)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriInvoiceBullet3)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriMoAdvice)).toBeInTheDocument();
      });

      test("when iar is required and final claim is false", () => {
        const { queryByText } = setup({
          competitionType: "SBRI",
          isIarRequired: true,
          isFinalClaim: false,
          content: stubContent,
        });
        expect(queryByText(stubContent.iarRequired)).toBeInTheDocument();

        expect(queryByText(stubContent.sbriDocumentAdvice)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriInvoiceBullet1)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriInvoiceBullet2)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriInvoiceBullet3)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriMoAdvice)).toBeInTheDocument();
      });

      test("when iar is not required and final claim is false", () => {
        const { queryByText } = setup({
          competitionType: "SBRI",
          isIarRequired: false,
          isFinalClaim: false,
          content: stubContent,
        });
        expect(queryByText(stubContent.sbriDocumentAdvice)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriInvoiceBullet1)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriInvoiceBullet2)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriInvoiceBullet3)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriMoAdvice)).toBeInTheDocument();
      });

      test("when iar is not required and final claim is true", () => {
        const { queryByText } = setup({
          competitionType: "SBRI",
          isIarRequired: false,
          isFinalClaim: true,
          content: stubContent,
        });
        expect(queryByText(stubContent.finalClaimGuidanceContent1)).toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimStep1)).toBeInTheDocument();
        expect(queryByText(stubContent.finalClaimStep2)).toBeInTheDocument();

        expect(queryByText(stubContent.sbriDocumentAdvice)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriInvoiceBullet1)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriInvoiceBullet2)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriInvoiceBullet3)).toBeInTheDocument();
        expect(queryByText(stubContent.sbriMoAdvice)).toBeInTheDocument();
      });
    });
  });
});
