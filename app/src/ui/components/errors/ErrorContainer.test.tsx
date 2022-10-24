import { render } from "@testing-library/react";

import { TestBed, TestBedStore } from "@shared/TestBed";
import { ErrorContainer, ErrorContainerProps } from "@ui/components/errors";
import { ErrorCode } from "@framework/constants";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("<ErrorContainer />", () => {
  describe("@renders", () => {
    const stubContent = {
      pages: {
        genericFallbackError: {
          message: "stub-standardError",
          dashboardText: "stub-dashboardText",
        },
        unauthenticatedError: {
          preLinkContent: "stub-contactUsPreLinkContent",
          linkTextContent: "stub-contactUsLinkTextContent",
          postLinkContent: "stub-contactUsPostLinkContent",
        },
        notFoundError: {
          errorMessage: "stub-notFoundError",
          goBackMessage: "stub-goBackMessage",
          innovateUkMessage: "stub-innovateUkMessage",
          yourDashBoard: "stub-yourDashboardMessage",
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

    const setup = (props: ErrorContainerProps) =>
      render(
        <TestBed stores={testStore as unknown as TestBedStore}>
          <ErrorContainer {...props} />
        </TestBed>,
      );

    beforeAll(async () => {
      testInitialiseInternationalisation(stubContent);
    });

    describe("with fallback error", () => {
      test("when no errorType matches a value in error config", () => {
        const { queryByTestId } = setup({
          errorType: "THIS_SHOULD_NEVER_MATCH",
          errorCode: ErrorCode.UNKNOWN_ERROR,
        });

        const targetElement = queryByTestId("fallback-error");

        expect(targetElement).toBeInTheDocument();
      });
    });

    describe("with internal errors", () => {
      test("when not found", () => {
        const { queryByTestId } = setup({
          errorType: "NOT_FOUND",
          errorCode: ErrorCode.UNKNOWN_ERROR,
        });

        const targetElement = queryByTestId("not-found");

        expect(targetElement).toBeInTheDocument();
      });

      test("when authentication fails", () => {
        const { queryByTestId } = setup({
          errorType: "AUTHENTICATION_ERROR",
          errorCode: ErrorCode.UNKNOWN_ERROR,
        });

        const targetElement = queryByTestId("unauthenticated-error");

        expect(targetElement).toBeInTheDocument();
      });
    });
  });
});
