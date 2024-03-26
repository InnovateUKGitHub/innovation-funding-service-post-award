import { ErrorCode } from "@framework/constants/enums";
import { IAppError } from "@framework/types/IAppError";
import TestBed from "@shared/TestBed";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { render } from "@testing-library/react";
import { Page, PageProps } from "@ui/components/bjss/Page/page";
import { Result } from "@ui/validation/result";
import { Results } from "@ui/validation/results";

describe("<Page />", () => {
  const stubTitleQa = "title-qa";
  const stubChildrenQa = "children-qa";

  const defaultProps: PageProps = {
    pageTitle: <h1 data-qa={stubTitleQa}>stub title</h1>,
    children: <div data-qa={stubChildrenQa}>stub children</div>,
    isActive: true,
  };

  const stubContent = {
    components: {
      validationSummary: {
        title: "stub-validationsTitle",
      },
      errorSummary: {
        errorTitle: "stub-errorTitle",
        expiredMessageContent: "stub-expiredMessageContent",
        unsavedWarningContent: "stub-unsavedWarningContent",
        somethingGoneWrongContent: "stub-somethingGoneWrongContent",
        updateAllFailure: "stub-updateAllFailure",
        insufficientAccessRights: "stub-insufficientAccessRights",
        notUploadedByOwner: "stub-notUploadedByOwner",
      },
      projectInactiveContent: {
        projectOnHoldMessage: "stub-projectOnHoldMessage",
        partnerOnHoldMessage: "stub-partnerOnHoldMessage",
      },
    },
  };

  beforeAll(async () => {
    initStubTestIntl(stubContent);
  });

  const setup = (props?: Partial<PageProps>) => {
    const result = render(
      <TestBed>
        <Page {...defaultProps} {...props} />
      </TestBed>,
    );

    const holdMessageElementQa = "on-hold-info-message";
    const backLinkElementQa = "page-backlink";
    const pageErrorElementQa = "error-summary";
    const validationSummaryQa = "validation-summary";

    return {
      ...result,
      holdMessageElementQa,
      backLinkElementQa,
      pageErrorElementQa,
      validationSummaryQa,
    };
  };

  describe("@renders", () => {
    it("with default props", () => {
      const { queryByTestId, pageErrorElementQa, backLinkElementQa, holdMessageElementQa } = setup();

      expect(queryByTestId(stubTitleQa)).toBeInTheDocument();
      expect(queryByTestId(stubChildrenQa)).toBeInTheDocument();

      expect(queryByTestId(pageErrorElementQa)).not.toBeInTheDocument();
      expect(queryByTestId(backLinkElementQa)).not.toBeInTheDocument();
      expect(queryByTestId(holdMessageElementQa)).not.toBeInTheDocument();
    });

    it("with a backLink", () => {
      const { backLinkElementQa, queryByTestId } = setup({ backLink: <div>backlink element</div> });

      expect(queryByTestId(backLinkElementQa)).toBeInTheDocument();
    });

    it("with a qa", () => {
      const stubQa = "stub-qa";
      const { queryByTestId } = setup({ qa: stubQa });

      expect(queryByTestId(stubQa)).toBeInTheDocument();
    });
  });

  it("with an <ErrorSummary />", () => {
    const stubAppError: IAppError = {
      code: ErrorCode.BAD_REQUEST_ERROR,
      message: "stub-message",
      results: null,
      details: [],
    };

    const { queryByTestId, pageErrorElementQa } = setup({ error: stubAppError });

    expect(queryByTestId(pageErrorElementQa)).toBeInTheDocument();
  });

  describe("with a <ValidationSummary />", () => {
    const stubError1: Result = new Result(null, true, false, "stub-1-errorMessage", false, "stub1");
    const stubError2: Result = new Result(null, true, false, "stub-2-errorMessage", false, "stub2");

    it("with a singular validation", () => {
      const singleValidation: PageProps["validator"] = new Results({
        model: {},
        showValidationErrors: false,
        results: [stubError1],
      });
      const { queryByText } = setup({ validator: singleValidation });

      expect(queryByText(stubContent.components.validationSummary.title)).toBeInTheDocument();
    });

    it("with multiple validations", () => {
      const stubValidationArray1 = new Results({ model: {}, showValidationErrors: false, results: [stubError1] });
      const stubValidationArray2 = new Results({ model: {}, showValidationErrors: false, results: [stubError2] });
      const arrayOfValidations: PageProps["validator"] = [stubValidationArray1, stubValidationArray2];

      const { queryByText } = setup({ validator: arrayOfValidations });

      expect(queryByText(stubContent.components.validationSummary.title)).toBeInTheDocument();
    });
  });
});
