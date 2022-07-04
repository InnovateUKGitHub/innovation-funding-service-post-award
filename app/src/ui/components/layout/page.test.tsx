import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import TestBed, { hookTestBed, TestBedContent } from "@shared/TestBed";
import { ErrorCode, IAppError, PartnerStatus, ProjectStatus } from "@framework/types";
import { Result, Results } from "@ui/validation";

import {
  Page,
  PageProps,
  PageValidationPartnerStatus,
  PageValidationProjectStatus,
  usePageValidationMessage,
} from "@ui/components/layout/page";

describe("usePageValidationMessage()", () => {
  const stubContent = {
    components: {
      projectInactiveContent: {
        projectOnHoldMessage: { content: "stub-projectOnHoldMessage" },
        partnerOnHoldMessage: { content: "stub-partnerOnHoldMessage" },
      },
    },
  };

  const renderPageContent = (project: PageValidationProjectStatus, partner: PageValidationPartnerStatus) => {
    return renderHook(
      () => usePageValidationMessage(project, partner),
      hookTestBed({ content: stubContent as TestBedContent }),
    );
  };

  it("should return null", () => {
    const { result } = renderPageContent(ProjectStatus.Live, PartnerStatus.Active);

    expect(result.current).toBeNull();
  });

  it("should return project hold message", () => {
    const { result } = renderPageContent(ProjectStatus.OnHold, PartnerStatus.Active);

    expect(result.current).toBe(stubContent.components.projectInactiveContent.projectOnHoldMessage.content);
  });

  it("should return partner hold message", () => {
    const { result } = renderPageContent(ProjectStatus.Live, PartnerStatus.OnHold);

    expect(result.current).toBe(stubContent.components.projectInactiveContent.partnerOnHoldMessage.content);
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
        validationsTitle: { content: "stub-validationsTitle" },
      },
      errorSummary: {
        errorTitle: { content: "stub-errorTitle" },
        expiredMessageContent: { content: "stub-expiredMessageContent" },
        unsavedWarningContent: { content: "stub-unsavedWarningContent" },
        somethingGoneWrongContent: { content: "stub-somethingGoneWrongContent" },
        updateAllFailure: { content: "stub-updateAllFailure" },
        insufficienceAccessRights: { content: "stub-insufficienceAccessRights" },
        notUploadedByOwner: { content: "stub-notUploadedByOwner" },
      },
      projectInactiveContent: {
        projectOnHoldMessage: { content: "stub-projectOnHoldMessage" },
        partnerOnHoldMessage: { content: "stub-partnerOnHoldMessage" },
      },
    },
  };

  const setup = (props?: Partial<PageProps>) => {
    const result = render(
      <TestBed content={stubContent as TestBedContent}>
        <Page {...defaultProps} {...props} />
      </TestBed>,
    );

    const holdMessageElementQa = "on-hold-info-message";
    const backlinkElementQa = "page-backlink";
    const pageErrorElementQa = "error-summary";
    const validationSummaryQa = "validation-summary";

    return {
      ...result,
      holdMessageElementQa,
      backlinkElementQa,
      pageErrorElementQa,
      validationSummaryQa,
    };
  };

  describe("@renders", () => {
    it("with default props", () => {
      const { queryByTestId, pageErrorElementQa, backlinkElementQa, holdMessageElementQa } = setup();

      expect(queryByTestId(stubTitleQa)).toBeInTheDocument();
      expect(queryByTestId(stubChildrenQa)).toBeInTheDocument();

      expect(queryByTestId(pageErrorElementQa)).not.toBeInTheDocument();
      expect(queryByTestId(backlinkElementQa)).not.toBeInTheDocument();
      expect(queryByTestId(holdMessageElementQa)).not.toBeInTheDocument();
    });

    it("with a backLink", () => {
      const { backlinkElementQa, queryByTestId } = setup({ backLink: <div>backlink element</div> });

      expect(queryByTestId(backlinkElementQa)).toBeInTheDocument();
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

      expect(queryByText(stubContent.components.validationSummary.validationsTitle.content)).toBeInTheDocument();
    });

    it("with multiple validations", () => {
      const stubValidationArray1 = new Results({}, false, [stubError1]);
      const stubValidationArray2 = new Results({}, false, [stubError2]);
      const arrayOfValidations: PageProps["validator"] = [stubValidationArray1, stubValidationArray2];

      const { queryByText } = setup({ validator: arrayOfValidations });

      expect(queryByText(stubContent.components.validationSummary.validationsTitle.content)).toBeInTheDocument();
    });
  });

  describe("renders a hold message", () => {
    test.each`
      name                | props                                                          | expectedMessage
      ${"with a project"} | ${{ project: { status: ProjectStatus.OnHold } as any }}        | ${stubContent.components.projectInactiveContent.projectOnHoldMessage.content}
      ${"with a partner"} | ${{ partner: { partnerStatus: PartnerStatus.OnHold } as any }} | ${stubContent.components.projectInactiveContent.partnerOnHoldMessage.content}
    `("$name on hold", ({ props, expectedMessage }) => {
      const { holdMessageElementQa, queryByTestId } = setup(props);

      expect(queryByTestId(holdMessageElementQa)).toHaveTextContent(expectedMessage);
    });
  });
});