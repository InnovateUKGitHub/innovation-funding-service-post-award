import { render } from "@testing-library/react";

import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ClaimsDashboardGuidance, ClaimsDashboardGuidanceProps } from "./ClaimsDashboardGuidance";
import { TestBed } from "@shared/TestBed";
import { initStubTestIntl } from "@shared/initStubTestIntl";

describe("<ClaimsDashboardGuidance />", () => {
  describe("@renders", () => {
    const stubContent = {
      claimsMessages: {
        guidanceMessage: "stub-guidanceMessage",
        overdueGuidanceMessage: {
          message: "Deadline past. Too late. Email <0 /> for more information.",
          email: "webmaster@example.com",
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
      await initStubTestIntl(stubContent);
    });

    test("when overdue claim", () => {
      const { queryByTestId } = setup({ overdueProject: true });

      const guidanceMessage = queryByTestId("guidance-message");
      expect(guidanceMessage).toBeInTheDocument();
      expect(guidanceMessage).toMatchSnapshot();
    });

    describe("when not overdue", () => {
      test.each`
        name             | inputRoles                                     | expectedContent
        ${"when FC"}     | ${ProjectRolePermissionBits.FinancialContact}  | ${stubContent.claimsMessages.guidanceMessage}
        ${"when not FC"} | ${ProjectRolePermissionBits.MonitoringOfficer} | ${stubContent.claimsMessages.guidanceMessage}
      `("when not overdue partner as non SBRI competition $name", ({ inputRoles, expectedContent }) => {
        const { container, queryByText } = setup({
          competitionType: "CR&D",
          roles: inputRoles,
          overdueProject: false,
        });

        expect(queryByText(expectedContent)).toBeInTheDocument();
        expect(container.querySelector(".markdown")).toBeInTheDocument();
      });

      test.each`
        name             | inputRoles                                     | shouldHaveMarkdownElement | expectedContent
        ${"when FC"}     | ${ProjectRolePermissionBits.FinancialContact}  | ${false}                  | ${stubContent.claimsMessages.guidanceMessage}
        ${"when not FC"} | ${ProjectRolePermissionBits.MonitoringOfficer} | ${true}                   | ${stubContent.claimsMessages.guidanceMessage}
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
            // eslint-disable-next-line jest/no-conditional-expect
            expect(container.querySelector(".markdown")).toBeInTheDocument();
          } else {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(container.querySelector(".markdown")).not.toBeInTheDocument();
          }
        },
      );
    });
  });
});
