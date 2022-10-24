import { render } from "@testing-library/react";

import { TestBed } from "@shared/TestBed";
import { MemoizedDashboardProject as DashboardProject } from "@ui/containers/projects/dashboard/DashboardProject";
import { DashboardProjectProps } from "@ui/containers/projects/dashboard/Dashboard.interface";
import { createPartnerDto, createProjectDto } from "@framework/util/stubDtos";
import { PartnerClaimStatus, ProjectRole, ProjectStatus } from "@framework/constants";
import { PartnerDto, ProjectDto } from "@framework/dtos";

import { findByTextContent } from "@tests/test-utils/rtl-helpers";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("<DashboardProject />", () => {
  const stubContent = {
    projectMessages: {
      pendingProject: "stub-pendingProject",
      projectOnHold: "stub-projectOnHold",
      checkForecast: "stub-checkForecast",
      claimToSubmitMessage: "stub-claimToSubmit",
      claimQueriedMessage: "stub-claimQueried",
      claimRequestMissingDocument: "stub-claimRequestMissingDocument",
      pcrQueried: "stub-pcrQueried",
      projectEndedMessage: "stub-projectEnded",
      claimsToReviewMessage: "stub-claimsToReview count = {{count}}",
      claimOverdueMessage: "stub-claimOverdue count = {{count}}",
      pcrsToReview: "stub-pcrsToReview count = {{count}}",
    },
  };

  const stubProjectSetupLink = jest.fn().mockReturnValue({
    routeName: "stub-projectSetup-routeName",
    path: "stub-projectSetup-routeName",
    routeParams: {},
    accessControl: true,
  });

  const stubProjectOverviewLink = jest.fn().mockReturnValue({
    routeName: "stub-projectOverview-routeName",
    path: "stub-projectOverview-routeName",
    routeParams: {},
    accessControl: true,
  });

  const defaultProps: DashboardProjectProps = {
    project: createProjectDto({
      leadPartnerName: "default-leadPartnerName",
      claimsToReview: 0,
      claimsOverdue: 0,
    }),
    section: "archived",
    routes: {
      projectSetup: {
        getLink: stubProjectSetupLink,
      },
      projectOverview: {
        getLink: stubProjectOverviewLink,
      },
    } as unknown as DashboardProjectProps["routes"],
  };

  const setup = (props: Partial<DashboardProjectProps>) => {
    return render(
      <TestBed>
        <DashboardProject {...defaultProps} {...props} />
      </TestBed>,
    );
  };

  beforeEach(jest.clearAllMocks);

  beforeAll(async () => {
    await testInitialiseInternationalisation(stubContent);
  });

  describe("@renders", () => {
    describe("with projects action visibility", () => {
      test.each`
        name                                                           | inboundProps                                                                                 | expectedActionVisible
        ${"when archived"}                                             | ${{ section: "archived" }}                                                                   | ${false}
        ${"when upcoming"}                                             | ${{ section: "upcoming" }}                                                                   | ${false}
        ${"when pending"}                                              | ${{ section: "pending" }}                                                                    | ${true}
        ${"when open fallback state"}                                  | ${{ section: "open" }}                                                                       | ${false}
        ${"when open with partner with no actions or claims due"}      | ${{ section: "open", partner: { claimStatus: PartnerClaimStatus.ClaimSubmitted } }}          | ${false}
        ${"when open with partner claims overdue"}                     | ${{ section: "open", partner: { claimStatus: PartnerClaimStatus.ClaimsOverdue } }}           | ${true}
        ${"when open with partner claimsStatus IARRequired"}           | ${{ section: "open", partner: { claimStatus: PartnerClaimStatus.IARRequired } }}             | ${true}
        ${"when open with partner claimsStatus is not ClaimSubmitted"} | ${{ section: "open", partner: { claimStatus: PartnerClaimStatus.ClaimQueried } }}            | ${true}
        ${"when open with partner claimsStatus is not NoClaimsDue"}    | ${{ section: "open", partner: { claimStatus: PartnerClaimStatus.ClaimDue } }}                | ${true}
        ${"when open with project MO with claims overdue"}             | ${{ section: "open", project: { roles: ProjectRole.MonitoringOfficer, claimsOverdue: 1 } }}  | ${true}
        ${"when open with project MO with claims to review"}           | ${{ section: "open", project: { roles: ProjectRole.MonitoringOfficer, claimsToReview: 1 } }} | ${true}
      `("$name", ({ inboundProps, expectedActionVisible }) => {
        const { container } = setup(inboundProps);

        const projectWithAction = container.querySelector(".acc-list-item__actionRequired");

        if (expectedActionVisible) {
          expect(projectWithAction).toBeInTheDocument();
        } else {
          expect(projectWithAction).not.toBeInTheDocument();
        }
      });
    });

    describe("with project title", () => {
      beforeEach(() => {
        expect(stubProjectSetupLink).toHaveBeenCalledTimes(0);
        expect(stubProjectOverviewLink).toHaveBeenCalledTimes(0);
      });

      test("when upcoming", () => {
        const stubProject = { projectNumber: "1111", title: "stub-title" } as ProjectDto;
        const { queryByText } = setup({ section: "upcoming", project: stubProject });

        const titleElement = queryByText(`${stubProject.projectNumber}: ${stubProject.title}`);

        expect(titleElement).toBeInTheDocument();
        expect(titleElement?.nodeName).toBe("H3");
        expect(stubProjectSetupLink).toHaveBeenCalledTimes(0);
        expect(stubProjectOverviewLink).toHaveBeenCalledTimes(0);
      });

      describe("with link to project setup", () => {
        test("without partner defined", () => {
          const stubProject = { projectNumber: "1111", title: "stub-title" } as ProjectDto;

          const { queryByText } = setup({
            section: "pending",
            project: stubProject,
          });

          const titleElement = queryByText(`${stubProject.projectNumber}: ${stubProject.title}`);

          expect(titleElement).toBeInTheDocument();
          expect(titleElement?.nodeName).toBe("A");
          expect(stubProjectSetupLink).toHaveBeenCalledTimes(0);
          expect(stubProjectOverviewLink).toHaveBeenCalledTimes(1);
        });

        test("when partner is defined", () => {
          const stubProject = { projectNumber: "1111", title: "stub-title" } as ProjectDto;
          const stubPartner = { id: "stub-id" } as PartnerDto;

          const { queryByText } = setup({
            section: "pending",
            project: stubProject,
            partner: stubPartner,
          });

          const titleElement = queryByText(`${stubProject.projectNumber}: ${stubProject.title}`);

          expect(titleElement).toBeInTheDocument();
          expect(titleElement?.nodeName).toBe("A");
          expect(stubProjectSetupLink).toHaveBeenCalledTimes(1);
          expect(stubProjectOverviewLink).toHaveBeenCalledTimes(0);
        });
      });

      test("with link to project overview", () => {
        const stubProject = { projectNumber: "1111", title: "stub-title" } as ProjectDto;
        const stubPartner = { id: "stub-id" } as PartnerDto;

        const { queryByText } = setup({
          section: "open",
          project: stubProject,
          partner: stubPartner,
        });

        const titleElement = queryByText(`${stubProject.projectNumber}: ${stubProject.title}`);

        expect(titleElement).toBeInTheDocument();
        expect(titleElement?.nodeName).toBe("A");
        expect(stubProjectSetupLink).toHaveBeenCalledTimes(0);
        expect(stubProjectOverviewLink).toHaveBeenCalledTimes(1);
      });
    });

    describe("with project notes", () => {
      test("with project lead partner name", () => {
        const stubProject = createProjectDto({ leadPartnerName: "stub-leadPartnerName" });
        const { queryByText } = setup({ section: "archived", project: stubProject });

        const leadPartnerName = queryByText(stubProject.leadPartnerName);

        expect(leadPartnerName).toBeInTheDocument();
      });

      test("with upcoming project message", async () => {
        const stubStartDate = new Date(2021, 8, 1);
        const stubEndDate = new Date(2021, 10, 1);

        const stubProject = createProjectDto({ startDate: stubStartDate, endDate: stubEndDate });

        setup({ section: "upcoming", project: stubProject });

        const upcomingDate = await findByTextContent("1 Sep to 1 Nov 2021");

        expect(upcomingDate).toBeInTheDocument();
      });

      describe("with available project section", () => {
        describe.each<DashboardProjectProps["section"]>(["open", "awaiting"])("when %s", projectSection => {
          describe("with project ended", () => {
            test("with no partner", () => {
              const stubProject = createProjectDto({ isPastEndDate: true });

              const { queryByText } = setup({ section: projectSection, project: stubProject });

              const projectEndedMessage = queryByText(stubContent.projectMessages.projectEndedMessage);

              expect(projectEndedMessage).toBeInTheDocument();
            });

            test("with partner withdrawn", () => {
              const stubPartner = createPartnerDto({ isWithdrawn: true });

              const { queryByText } = setup({ section: projectSection, partner: stubPartner });

              const projectEndedMessage = queryByText(stubContent.projectMessages.projectEndedMessage);

              expect(projectEndedMessage).toBeInTheDocument();
            });
          });

          describe("with project details", () => {
            test("as default", async () => {
              const stubPeriodStartDate = new Date(2021, 8, 1);
              const stubPeriodEndDate = new Date(2021, 10, 1);

              // Note: ensure date constructors in stubPeriodStartDate, stubPeriodEndDate match with below or this test will fail
              const expectedPeriodDateRange = "1 Sep to 1 Nov 2021";

              const stubProject = createProjectDto({
                periodStartDate: stubPeriodStartDate,
                periodEndDate: stubPeriodEndDate,
                periodId: 1,
                numberOfPeriods: 2,
              });

              setup({ section: projectSection, project: stubProject });

              const expectedText = `Period ${stubProject.periodId} of ${stubProject.numberOfPeriods} (${expectedPeriodDateRange})`;
              const projectPeriodBreakdown = await findByTextContent(expectedText);

              expect(projectPeriodBreakdown).toBeInTheDocument();
            });
          });
        });
      });
    });

    describe("with project actions", () => {
      test("when section is pending", () => {
        const { queryByText } = setup({ section: "pending" });

        const projectPendingMessage = queryByText(stubContent.projectMessages.pendingProject);

        expect(projectPendingMessage).toBeInTheDocument();
      });

      test("when section is archived", () => {
        const stubProject = createProjectDto({ statusName: "stub-statusName" });
        const { queryByText } = setup({ section: "archived", project: stubProject });

        expect(queryByText(stubProject.statusName)).toBeInTheDocument();
      });

      describe("with available projects", () => {
        describe.each<DashboardProjectProps["section"]>(["open", "awaiting"])("when %s", projectSection => {
          test("when on hold", () => {
            const stubProject = createProjectDto({ status: ProjectStatus.OnHold });
            const { queryByText } = setup({ section: projectSection, project: stubProject });

            const projectOnHoldMessage = queryByText(stubContent.projectMessages.projectOnHold);

            expect(projectOnHoldMessage).toBeInTheDocument();
          });

          describe("when FC and partner is defined", () => {
            test("when a new forecast is needed", () => {
              const stubProject = createProjectDto({ status: ProjectStatus.Live, roles: ProjectRole.FinancialContact });
              const stubPartner = createPartnerDto({ newForecastNeeded: true });

              const { queryByText } = setup({ section: projectSection, project: stubProject, partner: stubPartner });

              const partnerCheckForecastMessage = queryByText(stubContent.projectMessages.checkForecast);

              expect(partnerCheckForecastMessage).toBeInTheDocument();
            });

            describe("when claim status", () => {
              test.each`
                name                    | claimStatus                        | expectedMessage
                ${"with claim due"}     | ${PartnerClaimStatus.ClaimDue}     | ${stubContent.projectMessages.claimToSubmitMessage}
                ${"with claim queried"} | ${PartnerClaimStatus.ClaimQueried} | ${stubContent.projectMessages.claimQueriedMessage}
                ${"with IAR required"}  | ${PartnerClaimStatus.IARRequired}  | ${stubContent.projectMessages.claimRequestMissingDocument}
              `("$name", ({ claimStatus, expectedMessage }) => {
                const stubProject = createProjectDto({
                  status: ProjectStatus.Live,
                  roles: ProjectRole.FinancialContact,
                });
                const stubPartner = createPartnerDto({ claimStatus });

                const { queryByText } = setup({ section: projectSection, project: stubProject, partner: stubPartner });

                expect(queryByText(expectedMessage)).toBeInTheDocument();
              });
            });

            describe("with queried PCR's as a PM role", () => {
              test("with no PCR's", () => {
                const stubProject = createProjectDto({
                  status: ProjectStatus.Live,
                  roles: ProjectRole.ProjectManager,
                  pcrsQueried: 0,
                });

                const { queryByText } = setup({ section: projectSection, project: stubProject });

                const partnerPcrQueriedMessage = queryByText(stubContent.projectMessages.pcrQueried);

                expect(partnerPcrQueriedMessage).not.toBeInTheDocument();
              });

              test("with at least one PCR's", () => {
                const stubProject = createProjectDto({
                  status: ProjectStatus.Live,
                  roles: ProjectRole.ProjectManager,
                  pcrsQueried: 1,
                });

                const { queryByText } = setup({ section: projectSection, project: stubProject });

                const partnerPcrQueriedMessage = queryByText(stubContent.projectMessages.pcrQueried);

                expect(partnerPcrQueriedMessage).toBeInTheDocument();
              });
            });

            test("when MO role", () => {
              const stubProject = createProjectDto({
                status: ProjectStatus.Live,
                roles: ProjectRole.MonitoringOfficer,
                claimsToReview: 1,
                pcrsToReview: 1,
              });

              const { queryByText } = setup({ section: projectSection, project: stubProject });

              const claimsToReviewText = stubContent.projectMessages.claimsToReviewMessage.replace(
                "{{count}}",
                stubProject.claimsToReview.toFixed(0),
              );

              const pcrsToReviewText = stubContent.projectMessages.pcrsToReview.replace(
                "{{count}}",
                stubProject.pcrsToReview.toFixed(0),
              );

              const partnerClaimToReviewMessage = queryByText(claimsToReviewText);
              const partnerPcrsToReviewMessage = queryByText(pcrsToReviewText);

              expect(partnerClaimToReviewMessage).toBeInTheDocument();
              expect(partnerPcrsToReviewMessage).toBeInTheDocument();
            });
          });
        });
      });
    });
  });
});
