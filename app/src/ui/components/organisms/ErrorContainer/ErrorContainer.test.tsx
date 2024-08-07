import { render } from "@testing-library/react";
import { TestBed } from "@shared/TestBed";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { ErrorCode } from "@framework/constants/enums";
import { ErrorContainer } from "./ErrorContainer";
import { ClientErrorResponse } from "@server/errorHandlers";

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

    const setup = (error: ClientErrorResponse) =>
      render(
        <TestBed>
          <ErrorContainer error={error} />
        </TestBed>,
      );

    beforeAll(async () => {
      initStubTestIntl(stubContent);
    });

    describe("with fallback error", () => {
      test("when no errorType matches a value in error config", () => {
        const { queryByTestId } = setup({
          code: ErrorCode.UNKNOWN_ERROR,
          traceId: "UNKNOWN_ERROR",
        });

        const targetElement = queryByTestId("fallback-error");

        expect(targetElement).toBeInTheDocument();
      });
    });

    describe("with internal errors", () => {
      test("when not found", () => {
        const { queryByTestId } = setup({
          code: ErrorCode.NOT_FOUND,
          traceId: "NOT_FOUND",
        });

        const targetElement = queryByTestId("not-found");

        expect(targetElement).toBeInTheDocument();
      });

      test("when authentication fails", () => {
        const { queryByTestId } = setup({
          code: ErrorCode.UNAUTHENTICATED_ERROR,
          traceId: "UNAUTHENTICATED_ERROR",
        });

        const targetElement = queryByTestId("unauthenticated-error");

        expect(targetElement).toBeInTheDocument();
      });
    });
  });
});
