import { render } from "@testing-library/react";
import { TestBed } from "@shared/TestBed";
import { NotFoundError } from "@ui/components/errors";
import { initStubTestIntl } from "@shared/initStubTestIntl";

describe("<NotFoundErrorPage />", () => {
  describe("@renders", () => {
    const stubContent = {
      pages: {
        notFoundError: {
          goBackMessage: "It's a good idea to <0>go back</0> or visit the <1>Innovate UK homepage</1>.",
        },
      },
    };

    beforeAll(async () => {
      await initStubTestIntl(stubContent);
    });

    test("Contains description message", () => {
      const { queryByTestId } = render(
        <TestBed>
          <NotFoundError />
        </TestBed>,
      );

      const contentElement = queryByTestId("errorMessage");

      expect(contentElement).toBeInTheDocument();
      expect(contentElement).toMatchSnapshot();
    });
  });
});
