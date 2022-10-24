import { render } from "@testing-library/react";

import { TestBed } from "@shared/TestBed";
import { GenericFallbackError, GenericFallbackErrorProps } from "@ui/components/errors";
import { ErrorCode } from "@framework/types";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("<GenericFallbackError />", () => {
  describe("@renders", () => {
    const stubContent = {
      pages: {
        genericFallbackError: {
          message: "stub-message",
          dashboardText: "stub-dashboardText",
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
      await testInitialiseInternationalisation(stubContent);
    });

    test("with page message containing link text", () => {
      const { container } = setup({
        errorCode: ErrorCode.UNKNOWN_ERROR,
        errorType: "stub-errorType",
      });

      const expectedWrittenContent = [
        stubContent.pages.genericFallbackError.message,
        stubContent.pages.genericFallbackError.dashboardText,
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
