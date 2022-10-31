import { render } from "@testing-library/react";

import { TestBed, TestBedContent } from "@shared/TestBed";
import { ErrorContainer, ErrorContainerProps } from "@ui/components/errors";
import { ErrorCode } from "@framework/constants";

describe("<ErrorContainer />", () => {
  describe("@renders", () => {
    const stubContent = {
      errors: {
        genericFallback: {
          standardError: { content: "stub-standardError" },
          dashboardText: { content: "stub-dashboardText" },
        },
        unauthenticated: {
          contactUsPreLinkContent: { content: "stub-contactUsPreLinkContent" },
          contactUsLinkTextContent: { content: "stub-contactUsLinkTextContent" },
          contactUsPostLinkContent: { content: "stub-contactUsPostLinkContent" },
        },
        notfound: {
          notFoundError: { content: "stub-notFoundError" },
          goBackMessage: { content: "stub-goBackMessage" },
          innovateUKMessage: { content: "stub-innovateUKMessage" },
          yourDashboardMessage: { content: "stub-yourDashboardMessage" },
        },
      },
      components: {
        userChanger: {
          sectionTitle: { content: "stub-sectionTitle" },
          pickUserSubtitle: { content: "stub-pickUserSubtitle" },
          enterUserSubtitle: { content: "stub-enterUserSubtitle" },
          projectDropdownPlaceholder: { content: "stub-projectDropdownPlaceholder" },
          contactDropdownPlaceholder: { content: "stub-contactDropdownPlaceholder" },
          contactListEmpty: { content: "stub-contactListEmpty" },
          changeUserMessage: { content: "stub-changeUserMessage" },
          resetUserMessage: { content: "stub-resetUserMessage" },
          invalidUserMessage: { content: "stub-invalidUserMessage" },
        },
      },
    };

    const setup = (props: ErrorContainerProps) =>
      render(
        <TestBed content={stubContent as unknown as TestBedContent}>
          <ErrorContainer {...props} />
        </TestBed>,
      );

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
