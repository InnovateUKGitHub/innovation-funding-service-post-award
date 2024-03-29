import { render } from "@testing-library/react";
import TestBed from "@shared/TestBed";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { LoadingStatus, ErrorCode } from "@framework/constants/enums";
import { LoadingProps, PageLoader, Loader } from "./loading";
import { Pending } from "@shared/pending";

const stubContent = {
  pages: {
    genericFallbackError: {
      message: "stub-standardError",
      dashboardText: "stub-dashboardText",
    },
    unauthenticated: {
      preLinkContent: "stub-contactUsPreLinkContent",
      linkTextContent: "stub-contactUsLinkTextContent",
      postLinkContent: "stub-contactUsPostLinkContent",
    },
    notfound: {
      errorMessage: "stub-notFoundError",
      goBackMessage: "stub-goBackMessage",
      innovateUkMessage: "stub-innovateUkMessage",
      yourDashBoard: "stub-yourDashboardMessage",
    },
  },
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
    loading: {
      message: "stub-loading-message",
    },
  },
};

describe("<PageLoader />", () => {
  beforeAll(async () => {
    await initStubTestIntl(stubContent);
  });

  const setup = (props: LoadingProps<AnyObject>) =>
    render(
      <TestBed>
        <PageLoader {...props} />
      </TestBed>,
    );

  describe("@renders", () => {
    it("with error UI", () => {
      const stubRender = jest.fn();
      const { queryByTestId } = setup({
        render: stubRender,
        pending: new Pending(LoadingStatus.Failed, {}, { code: ErrorCode.REQUEST_ERROR }),
      });

      const targetElement = queryByTestId("not-found");

      expect(targetElement).toBeInTheDocument();
      expect(stubRender).toHaveBeenCalledTimes(0);
    });

    it("with custom renderError()", () => {
      const stubCustomErrorContent = "custom-error";
      const stubRender = jest.fn();
      const { getByText } = setup({
        render: stubRender,
        pending: new Pending(LoadingStatus.Failed),
        renderError: () => <div>{stubCustomErrorContent}</div>,
      });

      const targetElement = getByText(stubCustomErrorContent);

      expect(targetElement).toBeInTheDocument();
      expect(stubRender).toHaveBeenCalledTimes(0);
    });
  });
});

describe("<Loader />", () => {
  const pendingDone = new Pending(LoadingStatus.Done, {});
  const pendingPreload = new Pending(LoadingStatus.Preload, {});
  const pendingLoading = new Pending(LoadingStatus.Loading, null);
  const pendingFailed = new Pending(LoadingStatus.Failed, null);

  /**
   * setup test
   */
  function setup<T>(props: LoadingProps<T>) {
    return render(
      <TestBed>
        <Loader {...props} />
      </TestBed>,
    );
  }

  beforeEach(jest.clearAllMocks);

  describe("@renders", () => {
    it("should render with Preloaded state", () => {
      const { container } = setup({ render: jest.fn(), pending: pendingPreload });
      expect(container).toBeEmptyDOMElement();
    });

    describe("should render conditional element", () => {
      it.each`
        name                                 | renderFn                        | queryText        | expectedTagName
        ${"when string renders as span"}     | ${() => "string"}               | ${"string"}      | ${"SPAN"}
        ${"when number renders as span"}     | ${() => 0}                      | ${"0"}           | ${"SPAN"}
        ${"when jsx element renders as div"} | ${() => <div>jsx element</div>} | ${"jsx element"} | ${"DIV"}
      `("$name", ({ renderFn, queryText, expectedTagName }) => {
        const { getByText } = setup({ render: renderFn, pending: pendingDone });
        const renderedElementTagName = getByText(queryText).tagName;

        expect(renderedElementTagName).toBe(expectedTagName);
      });
    });

    describe.each`
      name                    | loadingStatus
      ${"with Stale state"}   | ${LoadingStatus.Stale}
      ${"with Loading state"} | ${LoadingStatus.Loading}
    `("should render $name", ({ loadingStatus }) => {
      it("should render when data is present", () => {
        const stubData = { stubData: "Hello World" };
        const stubRender = jest.fn();
        setup({
          render: stubRender,
          pending: new Pending(loadingStatus, stubData),
        });

        expect(stubRender).toHaveBeenCalledTimes(1);
        expect(stubRender).toHaveBeenCalledWith(stubData, true);
      });

      it("with renderLoading", () => {
        const stubLoaderQa = "custom-loader";
        const { getByTestId } = setup({
          render: jest.fn(),
          pending: pendingLoading,
          renderLoading: () => <div data-qa={stubLoaderQa}>some custom loader</div>,
        });

        expect(getByTestId(stubLoaderQa)).toBeInTheDocument();
      });

      it("with <LoadingMessage />", () => {
        const { getByText } = setup({
          render: jest.fn(),
          pending: pendingLoading,
        });

        expect(getByText(stubContent.components.loading.message)).toBeInTheDocument();
      });
    });

    it.each`
      name                                  | loadingStatus
      ${"should render with Updated state"} | ${LoadingStatus.Updated}
      ${"should render with Done state"}    | ${LoadingStatus.Done}
    `("$name", ({ loadingStatus }) => {
      const stubData = { stubData: "Hello rendered code!" };
      const stubRender = jest.fn();
      setup({
        render: stubRender,
        pending: new Pending(loadingStatus, stubData),
      });

      expect(stubRender).toHaveBeenCalledTimes(1);
      expect(stubRender).toHaveBeenCalledWith(stubData, false);
    });

    describe("should render with Failed state", () => {
      it("with error summary", () => {
        const { queryByTestId } = setup({
          render: jest.fn(),
          pending: pendingFailed,
        });

        const errorElement = queryByTestId("error-summary");

        expect(errorElement).toBeDefined();
      });

      describe("should render renderError", () => {
        it("with no error code", () => {
          const errorWithoutCode = new Pending(LoadingStatus.Failed, null);

          const { queryByText } = setup({
            render: jest.fn(),
            pending: errorWithoutCode,
            renderError: e => <div>{e.message}</div>,
          });

          const errorMessage = queryByText("An error has occurred while fetching data.");

          expect(errorMessage).toBeInTheDocument();
        });

        it("with an error code", () => {
          const stubPendingError = "stub-inbound-pending-error";

          const { queryByText } = setup({
            render: jest.fn(),
            pending: new Pending(LoadingStatus.Failed, null, { code: stubPendingError }),
            renderError: e => <div>{e.code}</div>,
          });

          const errorElement = queryByText(stubPendingError);

          expect(errorElement).toBeInTheDocument();
        });
      });

      describe("with ErrorSummary", () => {
        it("with no error code", () => {
          const { container, queryByTestId } = setup({ render: jest.fn(), pending: pendingPreload });

          expect(container).toBeEmptyDOMElement();
          expect(queryByTestId("error-summary")).toBeNull();
        });

        it("with an error code", () => {
          const { getByTestId } = setup({
            render: jest.fn(),
            pending: new Pending(LoadingStatus.Failed, {}, { code: "some-error" }),
          });
          expect(getByTestId("error-summary")).toBeInTheDocument();
        });
      });
    });
  });
});
