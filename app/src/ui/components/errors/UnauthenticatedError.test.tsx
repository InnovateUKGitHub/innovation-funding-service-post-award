import { render } from "@testing-library/react";
import { TestBed, TestBedStore } from "@shared/TestBed";
import { UnauthenticatedError } from "@ui/components/errors";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("<UnauthenticatedError />", () => {
  describe("@renders", () => {
    const stubContent = {
      pages: {
        unauthenticatedError: {
          preLinkContent: "stub-contactUsPreLinkContent",
          linkTextContent: "stub-contactUsLinkTextContent",
          postLinkContent: "stub-contactUsPostLinkContent",
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
      await testInitialiseInternationalisation(stubContent);
    });

    test("with page message containing link text", () => {
      const { container } = setup();

      const expectedWrittenContent = [
        stubContent.pages.unauthenticatedError.preLinkContent,
        stubContent.pages.unauthenticatedError.linkTextContent,
        stubContent.pages.unauthenticatedError.postLinkContent,
      ].join(" ");

      expect(container).toHaveTextContent(expectedWrittenContent);
    });
  });
});
