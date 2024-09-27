import { render } from "@testing-library/react";
import { TestBed } from "@shared/TestBed";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { ErrorCode } from "@framework/constants/enums";
import { GenericFallbackError } from "./GenericFallbackError";
import { ClientErrorResponse } from "@framework/util/errorHandlers";

describe("<GenericFallbackError />", () => {
  describe("@renders", () => {
    const stubContent = {
      pages: {
        genericFallbackError: {
          message: "Please use <0>Google</0>.",
        },
      },
    };

    const setup = (error?: ClientErrorResponse | null) =>
      render(
        <TestBed>
          <GenericFallbackError error={error}></GenericFallbackError>
        </TestBed>,
      );

    beforeAll(async () => {
      await initStubTestIntl(stubContent);
    });

    test("with page message containing link text", () => {
      const { queryByTestId } = setup({
        code: ErrorCode.UNKNOWN_ERROR,
        traceId: "with page messaging containing link text",
      });

      const message = queryByTestId("message");

      expect(message).toBeInTheDocument();
      expect(message).toMatchSnapshot();
    });

    describe("with developer error", () => {
      test("without errorMessage or errorStack", () => {
        const { container } = setup({
          code: ErrorCode.UNKNOWN_ERROR,
          traceId: "acc-traceid",
        });

        expect(container.querySelector("pre")).not.toBeInTheDocument();
      });

      test("with errorMessage", () => {
        const stubDeveloperError = "stub-developer-error";

        const { queryByText } = setup({
          code: ErrorCode.UNKNOWN_ERROR,
          message: stubDeveloperError,
          traceId: "acc-traceid",
        });

        expect(queryByText(stubDeveloperError, { selector: "p" })).toBeInTheDocument();
      });

      test("with errorStack", () => {
        const stubDeveloperError = "stub-developer-error";

        const { queryByText } = setup({
          code: ErrorCode.UNKNOWN_ERROR,
          stack: stubDeveloperError,
          traceId: "acc-traceid",
        });

        expect(queryByText(stubDeveloperError, { selector: "pre" })).toBeInTheDocument();
      });
    });
  });
});
