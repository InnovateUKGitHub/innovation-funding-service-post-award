import { render } from "@testing-library/react";
import { TestBed, TestBedStore } from "@shared/TestBed";
import { UnauthenticatedError } from "@ui/components/errors";
import { initStubTestIntl } from "@shared/initStubTestIntl";

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

    const testStore = {
      projects: {
        getProjectsAsDeveloper() {
          return [];
        },
      },
    };

    const setup = () =>
      render(
        <TestBed stores={testStore as unknown as TestBedStore}>
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
