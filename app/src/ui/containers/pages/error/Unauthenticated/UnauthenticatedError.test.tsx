import { render } from "@testing-library/react";
import { TestBed } from "@shared/TestBed";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { UnauthenticatedError } from "./UnauthenticatedError";

describe("<UnauthenticatedError />", () => {
  describe("@renders", () => {
    const stubContent = {
      pages: {
        unauthenticatedError: {
          contactUs: "Contact <0>Joe Grundman</0> to ask for forgivness",
        },
      },
      components: {
        userChanger: {
          sectionTitle: "stub-sectionTitle",
          pickUserSubtitle: "stub-pickUserSubtitle",
          enterUserSubtitle: "stub-enterUserSubtitle",
          projectDropdownPlaceholder: "stub-projectDropdownPlaceholder",
          contactDropdownPlaceholder: "stub-contactDropdownPlaceholder",
          contactListEmpty: "stub-contactListEmpty",
          changeUserMessage: "stub-changeUserMessage",
          resetUserMessage: "stub-resetUserMessage",
          invalidUserMessage: "stub-invalidUserMessage",
        },
      },
    };

    const setup = () =>
      render(
        <TestBed>
          <UnauthenticatedError />
        </TestBed>,
      );

    beforeAll(async () => {
      await initStubTestIntl(stubContent);
    });

    test("with page message containing link text", () => {
      const { queryByTestId } = setup();

      const reason = queryByTestId("reason");

      expect(reason).toBeInTheDocument();
      expect(reason).toMatchSnapshot();
    });
  });
});
