import { render } from "@testing-library/react";

import { ProjectRole } from "@framework/constants";
import { ClaimsDashboardGuidance, ClaimsDashboardGuidanceProps } from "@ui/containers/claims/components";
import { TestBed } from "@shared/TestBed";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("<ClaimsDashboardGuidance />", () => {
  describe("@renders", () => {
    const stubContent = {
      claimsMessages: {
        guidanceMessage: "stub-guidanceMessage",
        overdueGuidanceMessage: {
          message1: "stub-overdueGuidanceMessage1",
          message2: "stub-overdueGuidanceMessage2",
          message3: "stub-overdueGuidanceMessage3",
          message4: "stub-overdueGuidanceMessage4",
        },
      },
    };

    const setup = (props: ClaimsDashboardGuidanceProps) => {
      return render(
        <TestBed>
          <ClaimsDashboardGuidance {...props} />
        </TestBed>,
      );
    };

    beforeAll(async () => {
      await testInitialiseInternationalisation(stubContent);
    });

    test("when overdue claim", () => {
      const { queryByText } = setup({ overdueProject: true });

      const claimGuidanceMessages = stubContent.claimsMessages;

      expect(queryByText(claimGuidanceMessages.overdueGuidanceMessage.message1, { exact: false })).toBeInTheDocument();
      expect(queryByText(claimGuidanceMessages.overdueGuidanceMessage.message2, { exact: false })).toBeInTheDocument();
      expect(queryByText(claimGuidanceMessages.overdueGuidanceMessage.message3, { exact: false })).toBeInTheDocument();
      expect(queryByText(claimGuidanceMessages.overdueGuidanceMessage.message4, { exact: false })).toBeInTheDocument();
    });

    describe("when not overdue", () => {
      test.each`
        name             | inputRoles                       | expectedContent
        ${"when FC"}     | ${ProjectRole.FinancialContact}  | ${stubContent.claimsMessages.guidanceMessage}
        ${"when not FC"} | ${ProjectRole.MonitoringOfficer} | ${stubContent.claimsMessages.guidanceMessage}
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
        ${"when FC"}     | ${ProjectRole.FinancialContact}  | ${false}                  | ${stubContent.claimsMessages.guidanceMessage}
        ${"when not FC"} | ${ProjectRole.MonitoringOfficer} | ${true}                   | ${stubContent.claimsMessages.guidanceMessage}
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
