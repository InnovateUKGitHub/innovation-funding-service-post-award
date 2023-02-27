import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react";

import TestBed, { hookTestBed } from "@shared/TestBed";
import { ErrorCode, IAppError, PartnerStatus, ProjectStatus } from "@framework/types";
import { Result, Results } from "@ui/validation";

import { Page, PageProps, usePageValidationMessage } from "@ui/components/layout/page";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("usePageValidationMessage()", () => {
  const stubContent = {
    components: {
      projectInactiveContent: {
        projectOnHoldMessage: "stub-projectOnHoldMessage",
        partnerOnHoldMessage: "stub-partnerOnHoldMessage",
      },
    },
  };

  const renderPageContent = (project: ProjectStatus, partner: PartnerStatus) => {
    return renderHook(() => usePageValidationMessage(project, partner), hookTestBed({}));
  };

  beforeAll(async () => {
    testInitialiseInternationalisation(stubContent);
  });

  it("should return null", () => {
    const { result } = renderPageContent(ProjectStatus.Live, PartnerStatus.Active);

    expect(result.current).toBeNull();
  });

  it("should return project hold message", () => {
    const { result } = renderPageContent(ProjectStatus.OnHold, PartnerStatus.Active);

    expect(result.current).toBe(stubContent.components.projectInactiveContent.projectOnHoldMessage);
  });

  it("should return partner hold message", () => {
    const { result } = renderPageContent(ProjectStatus.Live, PartnerStatus.OnHold);

    expect(result.current).toBe(stubContent.components.projectInactiveContent.partnerOnHoldMessage);
  });
});

describe("<Page />", () => {
  const stubTitleQa = "title-qa";
  const stubChildrenQa = "children-qa";

  const defaultProps: PageProps = {
    pageTitle: <h1 data-qa={stubTitleQa}>stub title</h1>,
    children: <div data-qa={stubChildrenQa}>stub children</div>,
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
    testInitialiseInternationalisation(stubContent);
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
    };

    const { queryByTestId, pageErrorElementQa } = setup({ error: stubAppError });

    expect(queryByTestId(pageErrorElementQa)).toBeInTheDocument();
  });

  describe("with a <ValidationSummary />", () => {
    const stubError1: Result = new Result(null, true, false, "stub-1-errorMessage", false);
    const stubError2: Result = new Result(null, true, false, "stub-2-errorMessage", false);

    it("with a singular validation", () => {
      const singleValidation: PageProps["validator"] = new Results({}, false, [stubError1]);
      const { queryByText } = setup({ validator: singleValidation });

      expect(queryByText(stubContent.components.validationSummary.title)).toBeInTheDocument();
    });

    it("with multiple validations", () => {
      const stubValidationArray1 = new Results({}, false, [stubError1]);
      const stubValidationArray2 = new Results({}, false, [stubError2]);
      const arrayOfValidations: PageProps["validator"] = [stubValidationArray1, stubValidationArray2];

      const { queryByText } = setup({ validator: arrayOfValidations });

      expect(queryByText(stubContent.components.validationSummary.title)).toBeInTheDocument();
    });
  });

  describe("renders a hold message", () => {
    test.each`
      name                | props                                                   | expectedMessage
      ${"with a project"} | ${{ project: { status: ProjectStatus.OnHold } }}        | ${stubContent.components.projectInactiveContent.projectOnHoldMessage}
      ${"with a partner"} | ${{ partner: { partnerStatus: PartnerStatus.OnHold } }} | ${stubContent.components.projectInactiveContent.partnerOnHoldMessage}
    `("$name on hold", ({ props, expectedMessage }) => {
      const { holdMessageElementQa, queryByTestId } = setup(props);

      expect(queryByTestId(holdMessageElementQa)).toHaveTextContent(expectedMessage);
    });
  });
});
