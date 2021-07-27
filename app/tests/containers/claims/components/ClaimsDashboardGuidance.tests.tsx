import { render } from "@testing-library/react";

import { ProjectRole } from "@framework/constants";
import { ClaimsDashboardGuidance, ClaimsDashboardGuidanceProps } from "@ui/containers/claims/components";
import { TestBed, TestBedContent } from "@shared/TestBed";

describe("<ClaimsDashboardGuidance />", () => {
  describe("@renders", () => {
    const stubContent = {
      allClaimsDashboard: {
        messages: {
          guidanceMessage: { content: "stub-guidanceMessage" },
        },
      },
      claimsDashboard: {
        messages: {
          overdueGuidanceMessage1: { content: "stub-overdueGuidanceMessage1" },
          overdueGuidanceMessage2: { content: "stub-overdueGuidanceMessage2" },
          overdueGuidanceMessage3: { content: "stub-overdueGuidanceMessage3" },
          overdueGuidanceMessage4: { content: "stub-overdueGuidanceMessage4" },
        },
      },
    } as TestBedContent;

    const setup = (props: ClaimsDashboardGuidanceProps) => {
      return render(
        <TestBed content={stubContent}>
          <ClaimsDashboardGuidance {...props} />
        </TestBed>,
      );
    };

    test("when overdue claim", () => {
      if (!stubContent.claimsDashboard) throw Error("Missing claimsDashboard content!");

      const { queryByText } = setup({ overdueProject: true });

      const claimGuidanceMessages = stubContent.claimsDashboard.messages;

      expect(queryByText(claimGuidanceMessages.overdueGuidanceMessage1.content, { exact: false })).toBeInTheDocument();
      expect(queryByText(claimGuidanceMessages.overdueGuidanceMessage2.content, { exact: false })).toBeInTheDocument();
      expect(queryByText(claimGuidanceMessages.overdueGuidanceMessage3.content, { exact: false })).toBeInTheDocument();
      expect(queryByText(claimGuidanceMessages.overdueGuidanceMessage4.content, { exact: false })).toBeInTheDocument();
    });

    describe("when not overdue", () => {
      if (!stubContent.allClaimsDashboard) throw Error("Missing allClaimsDashboard content!");

      test.each`
        name             | inputRoles                       | expectedContent
        ${"when FC"}     | ${ProjectRole.FinancialContact}  | ${stubContent.allClaimsDashboard.messages.guidanceMessage.content}
        ${"when not FC"} | ${ProjectRole.MonitoringOfficer} | ${stubContent.allClaimsDashboard.messages.guidanceMessage.content}
      `("when not overdue partner as non SBRI competion $name", ({ inputRoles, expectedContent }) => {
        const { container, queryByText } = setup({
          competitionType: "CR&D",
          roles: inputRoles,
          overdueProject: false,
        });

        expect(queryByText(expectedContent)).toBeInTheDocument();
        expect(container.querySelector(".markdown")).toBeInTheDocument();
      });

      test.each`
        name             | inputRoles                       | shouldHaveMarkdownElement | expectedContent
        ${"when FC"}     | ${ProjectRole.FinancialContact}  | ${false}                  | ${stubContent.allClaimsDashboard.messages.guidanceMessage.content}
        ${"when not FC"} | ${ProjectRole.MonitoringOfficer} | ${true}                   | ${stubContent.allClaimsDashboard.messages.guidanceMessage.content}
      `(
        "when not overdue partner as a SBRI project $name",
        ({ inputRoles, shouldHaveMarkdownElement, expectedContent }) => {
          const { container, queryByText } = setup({
            competitionType: "SBRI",
            roles: inputRoles,
            overdueProject: false,
          });

          expect(queryByText(expectedContent)).toBeInTheDocument();

          if (shouldHaveMarkdownElement) {
            expect(container.querySelector(".markdown")).toBeInTheDocument();
          } else {
            expect(container.querySelector(".markdown")).not.toBeInTheDocument();
          }
        },
      );
    });
  });
});
