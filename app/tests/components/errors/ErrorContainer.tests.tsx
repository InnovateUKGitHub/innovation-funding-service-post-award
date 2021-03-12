import { render } from "@testing-library/react";

import { TestBed, TestBedContent } from "@shared/TestBed";
import { ErrorContainer, ErrorContainerProps } from "@ui/components/errors";

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
    };

    const setup = (props: ErrorContainerProps) =>
      render(
        <TestBed content={stubContent as TestBedContent}>
          <ErrorContainer {...props} />
        </TestBed>,
      );

    describe("with fallback error", () => {
      test("when no errorType is supplied", () => {
        const { queryByTestId } = setup({ errorType: undefined });

        const targetElement = queryByTestId("fallback-error");

        expect(targetElement).toBeInTheDocument();
      });

      test("when no errorType matches a custom component", () => {
        const { queryByTestId } = setup({ errorType: "I_SHOULD_NOT_MATCH_ANY_OBJECT_CONFIG" });

        const targetElement = queryByTestId("fallback-error");

        expect(targetElement).toBeInTheDocument();
      });
    });

    test("when not found", () => {
      const { queryByTestId } = setup({ errorType: "NOT_FOUND" });

      const targetElement = queryByTestId("not-found");

      expect(targetElement).toBeInTheDocument();
    });

    test("when authentication fails", () => {
      const { queryByTestId } = setup({ errorType: "AUTHENTICATION_ERROR" });

      const targetElement = queryByTestId("unauthenticated-error");

      expect(targetElement).toBeInTheDocument();
    });
  });
});
