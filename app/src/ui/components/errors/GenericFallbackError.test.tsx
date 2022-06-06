import { render } from "@testing-library/react";

import { TestBed, TestBedContent } from "@shared/TestBed";
import { GenericFallbackError, GenericFallbackErrorProps } from "@ui/components/errors";
import { ErrorCode } from "@framework/types";

describe("<GenericFallbackError />", () => {
  describe("@renders", () => {
    const stubContent = {
      errors: {
        genericFallback: {
          standardError: { content: "stub-standardError" },
          dashboardText: { content: "stub-dashboardText" },
        },
      },
    };

    const setup = (props: GenericFallbackErrorProps) =>
      render(
        <TestBed content={stubContent as TestBedContent}>
          <GenericFallbackError {...props} />
        </TestBed>,
      );

    test("with page message containing link text", () => {
      const { container } = setup({
        errorCode: ErrorCode.UNKNOWN_ERROR,
        errorType: "stub-errorType",
      });

      const expectedWrittenContent = [
        stubContent.errors.genericFallback.standardError.content,
        stubContent.errors.genericFallback.dashboardText.content,
      ].join(" ");

      expect(container).toHaveTextContent(expectedWrittenContent);
    });

    describe("with developer error", () => {
      test("without errorMessage", () => {
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

        expect(queryByText(stubDeveloperError, { selector: "pre" })).toBeInTheDocument();
      });
    });
  });
});
