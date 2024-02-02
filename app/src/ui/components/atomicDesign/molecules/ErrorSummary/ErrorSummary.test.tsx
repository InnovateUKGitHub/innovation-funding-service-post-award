import { render } from "@testing-library/react";
import TestBed from "@shared/TestBed";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { DetailedErrorCode, ErrorCode } from "@framework/constants/enums";
import { ErrorSummaryProps, ErrorSummary } from "./ErrorSummary";

describe("<ErrorSummary />", () => {
  const stubContent = {
    components: {
      errorSummary: {
        title: "stub-errorContent",
        expiredMessage: "stub-expiredMessageContent",
        unsavedWarning: "stub-unsavedWarningContent",
        somethingGoneWrong: "stub-somethingGoneWrongContent",
        somethingUnknownGoneWrong: "stub-somethingUnknownGoneWrong",
        updateAllFailure: "stub-updateAllFailure",
        insufficientAccessRights: "stub-insufficientAccessRights",
        notUploadedByOwner: "stub-notUploadedByOwner",
        details: {
          SFDC_SF_UPDATE_ALL_FAILURE: "stub-SFDC_SF_UPDATE_ALL_FAILURE",
          SFDC_INSUFFICIENT_ACCESS_OR_READONLY: "stub-SFDC_INSUFFICIENT_ACCESS_OR_READONLY",
          SFDC_NOT_UPLOADED_FROM_OWNER: "stub-SFDC_NOT_UPLOADED_FROM_OWNER",
          SFDC_CANNOT_USE_RECORD_TYPE: "stub-SFDC_CANNOT_USE_RECORD_TYPE",
          SFDC_STRING_TOO_LONG: "stub-SFDC_STRING_TOO_LONG",
        },
      },
    },
  };

  beforeAll(async () => {
    await initStubTestIntl(stubContent);
  });

  const setup = (props: ErrorSummaryProps) =>
    render(
      <TestBed>
        <ErrorSummary {...props} />
      </TestBed>,
    );

  describe("@content", () => {
    test("with title", () => {
      const { queryByText } = setup({ error: { code: ErrorCode.UNKNOWN_ERROR } });

      const titleElement = queryByText(stubContent.components.errorSummary.title);

      expect(titleElement).toBeInTheDocument();
    });

    describe("when unauthenticated", () => {
      test("as default", () => {
        const { queryByText } = setup({ error: { code: ErrorCode.UNAUTHENTICATED_ERROR } });

        const expiredMessageElement = queryByText(stubContent.components.errorSummary.expiredMessage);
        const unsavedMessageElement = queryByText(stubContent.components.errorSummary.unsavedWarning);

        expect(expiredMessageElement).toBeInTheDocument();
        expect(unsavedMessageElement).toBeInTheDocument();
      });
    });

    describe("when authenticated", () => {
      const availableErrorCodes = (Object.keys(ErrorCode) as (keyof typeof ErrorCode)[]).filter(
        key => typeof ErrorCode[key] === "number",
      );
      const allAuthenticatedErrors = availableErrorCodes.filter(
        key => ErrorCode[key] !== ErrorCode.UNAUTHENTICATED_ERROR,
      );

      describe("with error codes", () => {
        test.each(allAuthenticatedErrors)("with %s", errorKey => {
          const { queryByText } = setup({ error: { code: ErrorCode[errorKey] } });

          const fallbackErrorElement = queryByText(stubContent.components.errorSummary.somethingUnknownGoneWrong);

          expect(fallbackErrorElement).toBeInTheDocument();
        });
      });

      describe("with error messages", () => {
        test.each`
          name                                                          | code                                                      | expectedContent
          ${"with an update all failure"}                               | ${DetailedErrorCode.SFDC_SF_UPDATE_ALL_FAILURE}           | ${stubContent.components.errorSummary.details.SFDC_SF_UPDATE_ALL_FAILURE}
          ${"with insufficient access to remove claim line items"}      | ${DetailedErrorCode.SFDC_INSUFFICIENT_ACCESS_OR_READONLY} | ${stubContent.components.errorSummary.details.SFDC_INSUFFICIENT_ACCESS_OR_READONLY}
          ${"when the document owner does not match original uploader"} | ${DetailedErrorCode.SFDC_NOT_UPLOADED_FROM_OWNER}         | ${stubContent.components.errorSummary.details.SFDC_NOT_UPLOADED_FROM_OWNER}
        `("$name", ({ code, expectedContent }) => {
          const { queryByText } = setup({ error: { code: ErrorCode.SFDC_ERROR, details: [{ code }] } });

          const targetElement = queryByText(expectedContent);

          expect(targetElement).toBeInTheDocument();
        });
      });

      test("when authenticated with message missing", () => {
        const { queryByText } = setup({ error: { code: ErrorCode.UNKNOWN_ERROR, message: undefined } });

        const fallbackErrorElement = queryByText(stubContent.components.errorSummary.somethingUnknownGoneWrong);

        expect(fallbackErrorElement).toBeInTheDocument();
      });
    });
  });
});
