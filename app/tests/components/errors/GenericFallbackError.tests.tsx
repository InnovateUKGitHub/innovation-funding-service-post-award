import { render } from "@testing-library/react";

import { TestBed, TestBedContent } from "@shared/TestBed";
import { GenericFallbackError } from "@ui/components/errors";

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

    const setup = () =>
      render(
        <TestBed content={stubContent as TestBedContent}>
          <GenericFallbackError />
        </TestBed>,
      );

    test("with page message containing link text", () => {
      const { container } = setup();

      const expectedWrittenContent = [
        stubContent.errors.genericFallback.standardError.content,
        stubContent.errors.genericFallback.dashboardText.content,
      ].join(" ");

      expect(container).toHaveTextContent(expectedWrittenContent);
    });
  });
});
