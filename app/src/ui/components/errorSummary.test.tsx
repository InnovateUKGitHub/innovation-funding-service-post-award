import { render } from "@testing-library/react";

import { ErrorSummary, ErrorSummaryProps } from "@ui/components";
import { ErrorCode } from "@framework/types";
import TestBed from "@shared/TestBed";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("<ErrorSummary />", () => {
  const stubContent = {
    components: {
      errorSummary: {
        title: "stub-errorContent",
        expiredMessage: "stub-expiredMessageContent",
        unsavedWarning: "stub-unsavedWarningContent",
        somethingGoneWrong: "stub-somethingGoneWrongContent",
        updateAllFailure: "stub-updateAllFailure",
        insufficientAccessRights: "stub-insufficientAccessRights",
        notUploadedByOwner: "stub-notUploadedByOwner",
      },
    },
  };

  beforeAll(async () => {
    await testInitialiseInternationalisation(stubContent);
  });

  const setup = (props: ErrorSummaryProps) =>
    render(
      <TestBed>
        <ErrorSummary {...props} />
      </TestBed>,
    );

  describe("@content", () => {
    test("with title", () => {
      const { queryByText } = setup({ code: ErrorCode.UNKNOWN_ERROR });

      const titleElement = queryByText(stubContent.components.errorSummary.title);

      expect(titleElement).toBeInTheDocument();
    });

    describe("when unauthenticated", () => {
      test("as default", () => {
        const { queryByText } = setup({ code: ErrorCode.UNAUTHENTICATED_ERROR });

        const expiredMessageElement = queryByText(stubContent.components.errorSummary.expiredMessage);
        const unsavedMessageElement = queryByText(stubContent.components.errorSummary.unsavedWarning);

        expect(expiredMessageElement).toBeInTheDocument();
        expect(unsavedMessageElement).toBeInTheDocument();
      });
    });

    describe("when authenticated", () => {
      type ArrayOfErrorCodes = ErrorSummaryProps["code"][];
      const availableErrorCodes = Object.keys(ErrorCode).filter(key => typeof ErrorCode[key as any] === "number");
      const allAuthenticatedErrors = availableErrorCodes.filter(
        // TODO: We coerce the error code to a "keyof ErrorCode", then check against what we don't want. Code open to improvement
        key => (ErrorCode[key as any] as any) !== ErrorCode.UNAUTHENTICATED_ERROR,
      ) as unknown as ArrayOfErrorCodes;

      describe("with error codes", () => {
        test.each(allAuthenticatedErrors)("with %s", errorKey => {
          const { queryByText } = setup({ code: errorKey });

          const fallbackErrorElement = queryByText(stubContent.components.errorSummary.somethingGoneWrong);

          expect(fallbackErrorElement).toBeInTheDocument();
        });
      });

      describe("with error messages", () => {
        test.each`
          name                                                          | errorMessage                         | expectedContent
          ${"with an update all failure"}                               | ${"SF_UPDATE_ALL_FAILURE"}           | ${stubContent.components.errorSummary.updateAllFailure}
          ${"with insufficient access to remove claim line items"}      | ${"INSUFFICIENT_ACCESS_OR_READONLY"} | ${stubContent.components.errorSummary.insufficientAccessRights}
          ${"when the document owner does not match original uploader"} | ${"NOT_UPLOADED_FROM_OWNER"}         | ${stubContent.components.errorSummary.notUploadedByOwner}
        `("$name", ({ errorMessage, expectedContent }) => {
          const { queryByText } = setup({ code: ErrorCode.UNKNOWN_ERROR, message: errorMessage });

          const targetElement = queryByText(expectedContent);

          expect(targetElement).toBeInTheDocument();
        });
      });

      test("when authenticated with message missing", () => {
        const { queryByText } = setup({ code: ErrorCode.UNKNOWN_ERROR, message: undefined });

        const fallbackErrorElement = queryByText(stubContent.components.errorSummary.somethingGoneWrong);

        expect(fallbackErrorElement).toBeInTheDocument();
      });
    });
  });
});
