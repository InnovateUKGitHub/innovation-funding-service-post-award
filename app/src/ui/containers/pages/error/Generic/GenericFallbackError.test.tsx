import { render } from "@testing-library/react";
import { TestBed } from "@shared/TestBed";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { ErrorCode } from "@framework/constants/enums";
import { GenericFallbackErrorProps, GenericFallbackError } from "./GenericFallbackError";

describe("<GenericFallbackError />", () => {
  describe("@renders", () => {
    const stubContent = {
      pages: {
        genericFallbackError: {
          message: "Please use <0>Google</0>.",
        },
      },
    };

    const setup = (props: GenericFallbackErrorProps) =>
      render(
        <TestBed>
          <GenericFallbackError {...props} />
        </TestBed>,
      );

    beforeAll(async () => {
      await initStubTestIntl(stubContent);
    });

    test("with page message containing link text", () => {
      const { queryByTestId } = setup({
        errorCode: ErrorCode.UNKNOWN_ERROR,
        errorType: "stub-errorType",
      });

      const message = queryByTestId("message");

      expect(message).toBeInTheDocument();
      expect(message).toMatchSnapshot();
    });

    describe("with developer error", () => {
      test("without errorMessage or errorStack", () => {
        const { container } = setup({
          errorCode: ErrorCode.UNKNOWN_ERROR,
          errorType: "stub-errorType",
        });

        expect(container.querySelector("pre")).not.toBeInTheDocument();
      });

      test("with errorMessage", () => {
        const stubDeveloperError = "stub-developer-error";

        const { queryByText } = setup({
          errorCode: ErrorCode.UNKNOWN_ERROR,
          errorType: "stub-errorType",
          errorMessage: stubDeveloperError,
        });

        expect(queryByText(stubDeveloperError, { selector: "p" })).toBeInTheDocument();
      });

      test("with errorStack", () => {
        const stubDeveloperError = "stub-developer-error";

        const { queryByText } = setup({
          errorCode: ErrorCode.UNKNOWN_ERROR,
          errorType: "stub-errorType",
          errorStack: stubDeveloperError,
        });

        expect(queryByText(stubDeveloperError, { selector: "pre" })).toBeInTheDocument();
      });
    });
  });
});
