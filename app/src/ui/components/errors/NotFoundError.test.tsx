import { render } from "@testing-library/react";
import { TestBed } from "@shared/TestBed";
import { NotFoundError } from "@ui/components/errors";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("<NotFoundErrorPage />", () => {
  describe("@renders", () => {
    const stubContent = {
      pages: {
        notFoundError: {
          errorMessage: "stub-notFoundError",
          goBackMessage: "stub-goBackMessage",
          innovateUkMessage: "stub-innovateUkMessage",
          yourDashBoard: "stub-yourDashboardMessage",
        },
      },
    };

    const content = Object.entries(stubContent.pages.notFoundError);

    beforeAll(async () => {
      await testInitialiseInternationalisation(stubContent);
    });

    test.each(content)("with %s", (_key, value) => {
      const { queryByText } = render(
        <TestBed>
          <NotFoundError />
        </TestBed>,
      );

      const contentElement = queryByText(value, { exact: false });

      expect(contentElement).toBeInTheDocument();
    });
  });
});
