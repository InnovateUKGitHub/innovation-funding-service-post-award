import { render } from "@testing-library/react";

import { TestBed, TestBedContent } from "@shared/TestBed";
import { MemoizedDashboardProject as DashboardProject } from "@ui/containers/projects/dashboard/DashboardProject";
import { DashboardProjectProps } from "@ui/containers/projects/dashboard/Dashboard.interface";
import { createPartnerDto, createProjectDto } from "@framework/util/stubDtos";
import { PartnerClaimStatus, ProjectRole, ProjectStatus } from "@framework/constants";
import { PartnerDto, ProjectDto } from "@framework/dtos";

import { findByTextContent } from "../../../util/rtl-helpers";

describe("<DashboardProject />", () => {
  const stubContent = ({
    projectsDashboard: {
      messages: {
        pendingProject: { content: "stub-pendingProject" },
        projectOnHold: { content: "stub-projectOnHold" },
        checkForecast: { content: "stub-checkForecast" },
        claimToSubmit: { content: "stub-claimToSubmit" },
        claimQueried: { content: "stub-claimQueried" },
        claimRequiresIAR: { content: "stub-claimRequiresIAR" },
        pcrQueried: { content: "stub-pcrQueried" },
        projectEnded: { content: "stub-projectEnded" },
        claimsToReview: jest.fn().mockReturnValue({ content: "stub-claimsToReview" }),
        pcrsToReview: jest.fn().mockReturnValue({ content: "stub-pcrsToReview" }),
      },
    },
  } as any) as TestBedContent;

  const stubProjectSetupLink = jest.fn().mockReturnValue({
    routeName: "stub-projectSetup-routeName",
    routeParams: {},
    accessControl: true,
  });

  const stubProjectOverviewLink = jest.fn().mockReturnValue({
    routeName: "stub-projectOverview-routeName",
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
    routes: ({
      projectSetup: {
        getLink: stubProjectSetupLink,
      },
      projectOverview: {
        getLink: stubProjectOverviewLink,
      },
    } as unknown) as DashboardProjectProps["routes"],
  };

  const setup = (props: Partial<DashboardProjectProps>) => {
    return render(
      <TestBed content={stubContent as TestBedContent}>
        <DashboardProject {...defaultProps} {...props} />
      </TestBed>,
    );
  };

  beforeEach(jest.clearAllMocks);

  describe("@renders", () => {
    describe("with projects action visibility", () => {
      test.each`
        name                                                                  | inboundProps                                                                                          | expectedActionVisible
        ${"when archived"}                                                    | ${{ section: "archived" }}                                                                            | ${false}
        ${"when upcoming"}                                                    | ${{ section: "upcoming" }}                                                                            | ${false}
        ${"when pending"}                                                     | ${{ section: "pending" }}                                                                             | ${true}
        ${"when open fallback state"}                                         | ${{ section: "open" }}                                                                                | ${false}
        ${"when open with partner with no actions or claims due"}             | ${{ section: "open", partner: { claimsOverdue: 0, claimStatus: PartnerClaimStatus.ClaimSubmitted } }} | ${false}
        ${"when open with partner claims overdue"}                            | ${{ section: "open", partner: { claimsOverdue: 1, claimStatus: PartnerClaimStatus.ClaimSubmitted } }} | ${true}
        ${"when open with partner claims overdue with no unsubmitted status"} | ${{ section: "open", partner: { claimsOverdue: 1 } }}                                                 | ${true}
        ${"when open with partner claimsStatus IARRequired"}                  | ${{ section: "open", partner: { claimStatus: PartnerClaimStatus.IARRequired } }}                      | ${true}
        ${"when open with partner claimsStatus is not ClaimSubmitted"}        | ${{ section: "open", partner: { claimStatus: PartnerClaimStatus.Unknown } }}                          | ${true}
        ${"when open with partner claimsStatus is not NoClaimsDue"}           | ${{ section: "open", partner: { claimStatus: PartnerClaimStatus.ClaimDue } }}                         | ${true}
        ${"when open with project PM with claims overdue"}                    | ${{ section: "open", project: { roles: ProjectRole.ProjectManager, claimsOverdue: 1 } }}              | ${true}
        ${"when open with project MO with claims to review"}                  | ${{ section: "open", project: { roles: ProjectRole.MonitoringOfficer, claimsToReview: 1 } }}          | ${true}
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

      test("when upcomming", () => {
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

        const upcommingDate = await findByTextContent("1 Sep to 1 Nov 2021");

        expect(upcommingDate).toBeInTheDocument();
      });

      describe("with available project section", () => {
        describe.each<DashboardProjectProps["section"]>(["open", "awaiting"])(`when %s`, projectSection => {
          describe("with project ended", () => {
            test("with no partner", () => {
              const stubProject = createProjectDto({ isPastEndDate: true });

              const { queryByText } = setup({ section: projectSection, project: stubProject });

              if (!stubContent.projectsDashboard) throw Error("Missing projectsDashboard in stub content");

              const projectEndedMessage = queryByText(stubContent.projectsDashboard.messages.projectEnded.content);

              expect(projectEndedMessage).toBeInTheDocument();
            });

            test("with partner withdrawn", () => {
              const stubPartner = createPartnerDto({ isWithdrawn: true });

              const { queryByText } = setup({ section: projectSection, partner: stubPartner });

              if (!stubContent.projectsDashboard) throw Error("Missing projectsDashboard in stub content");

              const projectEndedMessage = queryByText(stubContent.projectsDashboard.messages.projectEnded.content);

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

        if (!stubContent.projectsDashboard) throw Error("Missing projectsDashboard in stub content");

        const projectPendingMessage = queryByText(stubContent.projectsDashboard.messages.pendingProject.content);

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

            if (!stubContent.projectsDashboard) throw Error("Missing projectsDashboard in stub content");

            const projectOnHoldMessage = queryByText(stubContent.projectsDashboard.messages.projectOnHold.content);

            expect(projectOnHoldMessage).toBeInTheDocument();
          });

          describe("when FC and partner is defined", () => {
            test("when a new forecast is needed", () => {
              const stubProject = createProjectDto({ status: ProjectStatus.Live, roles: ProjectRole.FinancialContact });
              const stubPartner = createPartnerDto({ newForecastNeeded: true });

              const { queryByText } = setup({ section: projectSection, project: stubProject, partner: stubPartner });

              if (!stubContent.projectsDashboard) throw Error("Missing projectsDashboard in stub content");

              const partnerCheckForecastMessage = queryByText(
                stubContent.projectsDashboard.messages.checkForecast.content,
              );

              expect(partnerCheckForecastMessage).toBeInTheDocument();
            });

            describe("when claim status", () => {
              if (!stubContent.projectsDashboard) throw Error("Missing projectsDashboard in stub content");

              test.each`
                name                    | claimStatus                        | expectedMessage
                ${"with claim due"}     | ${PartnerClaimStatus.ClaimDue}     | ${stubContent.projectsDashboard.messages.claimToSubmit.content}
                ${"with claim queried"} | ${PartnerClaimStatus.ClaimQueried} | ${stubContent.projectsDashboard.messages.claimQueried.content}
                ${"with IAR required"}  | ${PartnerClaimStatus.IARRequired}  | ${stubContent.projectsDashboard.messages.claimRequiresIAR.content}
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

                if (!stubContent.projectsDashboard) throw Error("Missing projectsDashboard in stub content");

                const partnerPcrQueriedMessage = queryByText(stubContent.projectsDashboard.messages.pcrQueried.content);

                expect(partnerPcrQueriedMessage).not.toBeInTheDocument();
              });

              test("with at least one PCR's", () => {
                const stubProject = createProjectDto({
                  status: ProjectStatus.Live,
                  roles: ProjectRole.ProjectManager,
                  pcrsQueried: 1,
                });

                const { queryByText } = setup({ section: projectSection, project: stubProject });

                if (!stubContent.projectsDashboard) throw Error("Missing projectsDashboard in stub content");

                const partnerPcrQueriedMessage = queryByText(stubContent.projectsDashboard.messages.pcrQueried.content);

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

              if (!stubContent.projectsDashboard) throw Error("Missing projectsDashboard in stub content");

              const partnerClaimToReviewMessage = queryByText(
                stubContent.projectsDashboard.messages.claimsToReview(stubProject.claimsToReview).content,
              );
              const partnerPcrsToReviewMessage = queryByText(
                stubContent.projectsDashboard.messages.pcrsToReview(stubProject.pcrsToReview).content,
              );

              expect(partnerClaimToReviewMessage).toBeInTheDocument();
              expect(partnerPcrsToReviewMessage).toBeInTheDocument();
            });
          });
        });
      });
    });
  });
});
