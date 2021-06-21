import { render } from "@testing-library/react";

import TestBed, { TestBedContent } from "@shared/TestBed";
import { ErrorCode, LoadingStatus } from "@framework/types";
import { Loader, LoadingProps, PageLoader } from "../../src/ui/components";
import { Pending } from "../../src/shared/pending";

const stubContent = {
  errors: {
    genericFallback: {
      standardError: { content: "stub-standardError" },
      dashboardText: { content: "stub-dashboardText" },
    },
    unauthenticated: {
      contactUsPreLinkContent: { content: "stub-contactUsPreLinkContent" },
      contactUsLinkTextContent: { content: "stub-contactUsLinkTextContent" },
      contactUsPostLinkContent: { content: "stub-contactUsPostLinkContent" },
    },
    notfound: {
      notFoundError: { content: "stub-notFoundError" },
      goBackMessage: { content: "stub-goBackMessage" },
      innovateUKMessage: { content: "stub-innovateUKMessage" },
      yourDashboardMessage: { content: "stub-yourDashboardMessage" },
    },
  },
  components: {
    errorSummary: {
      errorTitle: { content: "stub-errorContent" },
      expiredMessageContent: { content: "stub-expiredMessageContent" },
      unsavedWarningContent: { content: "stub-unsavedWarningContent" },
      somethingGoneWrongContent: { content: "stub-somethingGoneWrongContent" },
      updateAllFailure: { content: "stub-updateAllFailure" },
    },
    loading: {
      message: { content: "stub-loading-message" },
    },
  },
};

describe("<PageLoader />", () => {
  const setup = (props: LoadingProps<{}>) =>
    render(
      <TestBed content={stubContent as TestBedContent}>
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
      expect(stubRender).toBeCalledTimes(0);
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
      expect(stubRender).toBeCalledTimes(0);
    });
  });
});

describe("<Loader />", () => {
  const pendingDone = new Pending(LoadingStatus.Done, {});
  const pendingPreload = new Pending(LoadingStatus.Preload, {});
  const pendingLoading = new Pending(LoadingStatus.Loading, null);
  const pendingFailed = new Pending(LoadingStatus.Failed, {});

  const setup = <T extends unknown>(props: LoadingProps<T>) =>
    render(
      <TestBed content={stubContent as TestBedContent}>
        <Loader {...props} />
      </TestBed>,
    );

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

        expect(stubRender).toBeCalledTimes(1);
        expect(stubRender).toBeCalledWith(stubData, true);
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

        expect(getByText(stubContent.components.loading.message.content)).toBeInTheDocument();
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

      expect(stubRender).toBeCalledTimes(1);
      expect(stubRender).toBeCalledWith(stubData, false);
    });

    describe("should render with Failed state", () => {
      describe("should render renderError", () => {
        it("with no error code", () => {
          const stubWithoutErrorCodeQa = "renderError()-without-errorCode";
          const { getByTestId } = setup({
            render: jest.fn(),
            pending: pendingFailed,
            renderError: e => (
              <div data-qa={e && e.code ? "renderError()-with-code" : stubWithoutErrorCodeQa}>renderError test</div>
            ),
          });

          const errorElement = getByTestId(stubWithoutErrorCodeQa);

          expect(errorElement).toBeDefined();
        });

        it("with an error code", () => {
          const stubWithoutErrorCodeQa = "renderError()-with-errorCode";
          const { getByTestId } = setup({
            render: jest.fn(),
            pending: new Pending(LoadingStatus.Failed, {}, { code: "stub-error" }),
            renderError: e => (
              <div data-qa={e && e.code ? stubWithoutErrorCodeQa : "renderError-no-code"}>renderError test</div>
            ),
          });

          const errorElement = getByTestId(stubWithoutErrorCodeQa);

          expect(errorElement).toBeDefined();
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
