import { render } from "@testing-library/react";

import { TestBed, TestBedContent } from "@shared/TestBed";
import { NotFoundError } from "@ui/components/errors";
import { generateContentArray } from "@tests/test-utils/generate-content-array";

describe("<NotFoundErrorPage />", () => {
  describe("@renders", () => {
    const stubContent = {
      errors: {
        notfound: {
          notFoundError: { content: "stub-notFoundError" },
          goBackMessage: { content: "stub-goBackMessage" },
          innovateUKMessage: { content: "stub-innovateUKMessage" },
          yourDashboardMessage: { content: "stub-yourDashboardMessage" },
        },
      },
    };

    const content = generateContentArray(stubContent);

    test.each(content)("with %s", (_key, value) => {
      const { queryByText } = render(
        <TestBed content={stubContent as TestBedContent}>
          <NotFoundError />
        </TestBed>,
      );

      const contentElement = queryByText(value, { exact: false });

      expect(contentElement).toBeInTheDocument();
    });
  });
});
