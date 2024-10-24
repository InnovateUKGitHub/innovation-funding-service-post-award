import { DateTime } from "luxon";
import { TestContext } from "@tests/test-utils/testContextProvider";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { ClaimFrequency } from "@framework/constants/enums";
import {
  ProjectRolePermissionBits,
  ProjectMonitoringLevel,
  ProjectStatus,
  ProjectSource,
} from "@framework/constants/project";
import { ProjectDto } from "@framework/dtos/projectDto";
import { mapToProjectDto } from "./mapToProjectDto";

describe("mapToProjectDto", () => {
  const midnight = {
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  };

  it("when valid expect mapping", () => {
    const context = new TestContext();

    context.clock.setDate("2009/01/15");

    const projectStartDate = DateTime.fromFormat("2008-01-01", "yyyy-MM-dd");
    const projectEndDate = DateTime.fromFormat("2010-12-31", "yyyy-MM-dd");
    const periodStartDate = DateTime.fromFormat("2009-01-01", "yyyy-MM-dd");
    const periodEndDate = DateTime.fromFormat("2009-03-31", "yyyy-MM-dd");

    const expected: ProjectDto = {
      id: "Expected_Id" as ProjectId,
      title: "Expected title",
      startDate: projectStartDate.set(midnight).toJSDate(),
      endDate: projectEndDate.set(midnight).toJSDate(),
      isPastEndDate: true,
      summary: "Expected summary",
      description: "Expected description",
      projectNumber: "Expected project number",
      competitionType: "SBRI",
      claimFrequency: ClaimFrequency.Quarterly,
      claimFrequencyName: ClaimFrequency[ClaimFrequency.Quarterly],
      periodId: 3 as PeriodId,
      grantOfferLetterCosts: 2000,
      costsClaimedToDate: 1000,
      claimedPercentage: 50,
      periodStartDate: periodStartDate.set(midnight).toJSDate(),
      periodEndDate: periodEndDate.set(midnight).toJSDate(),
      pcrsQueried: 2,
      pcrsToReview: 3,
      roles: ProjectRolePermissionBits.Unknown,
      roleTitles: [],
      claimsOverdue: 5,
      claimsWithParticipant: 1,
      leadPartnerName: "Heathcliff",
      monitoringLevel: ProjectMonitoringLevel.Platinum,
      claimsToReview: 2,
      status: ProjectStatus.Live,
      statusName: "Live",
      numberOfOpenClaims: 10,
      numberOfPeriods: 5,
      durationInMonths: 15,
      isNonFec: false,
      loanEndDate: null,
      loanAvailabilityPeriodLength: null,
      loanExtensionPeriodLength: null,
      loanRepaymentPeriodLength: null,
      impactManagementParticipation: ImpactManagementParticipation.Unknown,
      projectSource: ProjectSource.Manual,
    };

    const project = context.testData.createProject(x => {
      x.Id = expected.id;
      x.Acc_ProjectSummary__c = expected.summary;
      x.Acc_PublicDescription__c = expected.description;
      x.Acc_ProjectTitle__c = expected.title;
      x.Acc_StartDate__c = projectStartDate.toFormat("yyyy-MM-dd");
      x.Acc_EndDate__c = projectEndDate.toFormat("yyyy-MM-dd");
      x.Acc_ProjectNumber__c = expected.projectNumber;
      x.Acc_ClaimFrequency__c = "Quarterly";
      x.Acc_GOLTotalCostAwarded__c = expected.grantOfferLetterCosts;
      x.Acc_TotalProjectCosts__c = expected.costsClaimedToDate;
      x.Acc_ProjectStatus__c = expected.statusName;
      x.Acc_PCRsUnderQuery__c = 2;
      x.Acc_PCRsForReview__c = 3;
      x.ProjectStatusName = expected.statusName;
      x.Acc_ClaimsOverdue__c = expected.claimsOverdue;
      x.Acc_ClaimsUnderQuery__c = expected.claimsWithParticipant;
      x.Acc_ClaimsForReview__c = expected.claimsToReview;
      x.Acc_CompetitionType__c = expected.competitionType;
      x.Acc_NumberOfOpenClaims__c = expected.numberOfOpenClaims;
      x.Acc_NumberofPeriods__c = expected.numberOfPeriods;
      x.Acc_CurrentPeriodNumber__c = expected.periodId;
      x.Acc_CurrentPeriodStartDate__c = periodStartDate.toFormat("yyyy-MM-dd");
      x.Acc_CurrentPeriodEndDate__c = periodEndDate.toFormat("yyyy-MM-dd");
      x.Acc_Duration__c = expected.durationInMonths;
      x.Acc_LeadParticipantName__c = expected.leadPartnerName;
      x.Acc_NonFEC__c = expected.isNonFec;
      x.Acc_MonitoringLevel__c = expected.monitoringLevel;
      x.Acc_ProjectSource__c = expected.projectSource;
      x.Loan_LoanEndDate__c = null;
      x.Loan_LoanAvailabilityPeriodLength__c = null;
      x.Loan_LoanExtensionPeriodLength__c = null;
      x.Loan_LoanRepaymentPeriodLength__c = null;
      x.Impact_Management_Participation__c = expected.impactManagementParticipation;
    });

    const result = mapToProjectDto(context, project, ProjectRolePermissionBits.Unknown);

    expect(result).toMatchObject(expected);
  });

  it("when ifs application url configured expect full url", async () => {
    const context = new TestContext();
    context.config.urls.ifsApplicationUrl =
      "https://ifs.application.url/application/competition/<<Acc_ProjectNumber__c>>/project/<<Acc_IFSApplicationId__c>>";

    const salesforce = context.testData.createProject(x => {
      x.Acc_ProjectSource__c = "IFS";
      x.Acc_IFSApplicationId__c = 1;
      x.Acc_ProjectNumber__c = "30000";
    });

    const result = mapToProjectDto(context, salesforce, ProjectRolePermissionBits.Unknown);

    expect(result.applicationUrl).toBe("https://ifs.application.url/application/competition/30000/project/1");
  });

  it("when ifs grant letter url configured expect full url", () => {
    const context = new TestContext();
    context.config.urls.ifsGrantLetterUrl =
      "https://ifs.application.url/grantletter/competition/<<Acc_ProjectNumber__c>>/project/<<Acc_IFSApplicationId__c>>";

    const project = context.testData.createProject(x => {
      x.Acc_ProjectSource__c = "IFS";
      x.Acc_IFSApplicationId__c = 1;
      x.Acc_ProjectNumber__c = "30000";
    });
    const result = mapToProjectDto(context, project, ProjectRolePermissionBits.Unknown);

    expect(result.grantOfferLetterUrl).toBe("https://ifs.application.url/grantletter/competition/30000/project/1");
  });

  it("should return hasEnded correctly", () => {
    const context = new TestContext();
    const projectNow = context.testData.createProject(x => {
      x.Acc_EndDate__c = DateTime.fromJSDate(new Date()).toFormat("yyyy-MM-dd");
    });
    const projectTomorrow = context.testData.createProject(x => {
      x.Acc_EndDate__c = DateTime.fromJSDate(new Date()).plus({ days: 1 }).toFormat("yyyy-MM-dd");
    });
    const projectYesterday = context.testData.createProject(x => {
      x.Acc_EndDate__c = DateTime.fromJSDate(new Date()).minus({ days: 1 }).toFormat("yyyy-MM-dd");
    });
    expect(mapToProjectDto(context, projectNow, ProjectRolePermissionBits.Unknown).isPastEndDate).toBe(false);
    expect(mapToProjectDto(context, projectTomorrow, ProjectRolePermissionBits.Unknown).isPastEndDate).toBe(false);
    expect(mapToProjectDto(context, projectYesterday, ProjectRolePermissionBits.Unknown).isPastEndDate).toBe(true);
  });

  it("ClaimFrequency should map correct - Quarterly", () => {
    const context = new TestContext();
    const salesforce = context.testData.createProject(x => {
      x.Acc_ClaimFrequency__c = "Quarterly";
    });
    const result = mapToProjectDto(context, salesforce, ProjectRolePermissionBits.Unknown);
    expect(result.claimFrequency).toBe(ClaimFrequency.Quarterly);
  });

  it("ClaimFrequency should map correct - Monthly", () => {
    const context = new TestContext();
    const salesforce = context.testData.createProject(x => {
      x.Acc_ClaimFrequency__c = "Monthly";
    });
    const result = mapToProjectDto(context, salesforce, ProjectRolePermissionBits.Unknown);
    expect(result.claimFrequency).toBe(ClaimFrequency.Monthly);
  });

  it("Gol Costs should be returned", () => {
    const context = new TestContext();

    const salesforce = context.testData.createProject(x => {
      x.Acc_GOLTotalCostAwarded__c = 100000;
    });

    const result = mapToProjectDto(context, salesforce, ProjectRolePermissionBits.Unknown);

    expect(result.grantOfferLetterCosts).toBe(100000);
  });

  it("Claimed Costs should be returned", () => {
    const context = new TestContext();

    const salesforce = context.testData.createProject(x => {
      x.Acc_TotalProjectCosts__c = 500000;
    });

    const result = mapToProjectDto(context, salesforce, ProjectRolePermissionBits.Unknown);

    expect(result.costsClaimedToDate).toBe(500000);
  });

  it("Non-FEC should be returned", () => {
    const context = new TestContext();
    const stubIsNonFec = true;

    const salesforce = context.testData.createProject(x => {
      x.Acc_NonFEC__c = stubIsNonFec;
    });

    const result = mapToProjectDto(context, salesforce, ProjectRolePermissionBits.Unknown);

    expect(result.isNonFec).toBeTruthy();
  });

  describe("with project loan fields", () => {
    describe("with loanEndDate", () => {
      it("with date", () => {
        const stubDate = DateTime.fromFormat("2009-03-31", "yyyy-MM-dd");
        const expectedDate = stubDate.set(midnight).toJSDate();

        const context = new TestContext();

        const salesforce = context.testData.createProject(x => {
          x.Loan_LoanEndDate__c = stubDate.toFormat("yyyy-MM-dd");
        });

        const { loanEndDate } = mapToProjectDto(context, salesforce, ProjectRolePermissionBits.Unknown);

        expect(loanEndDate).toStrictEqual(expectedDate);
      });

      it("without date", () => {
        const context = new TestContext();

        const salesforce = context.testData.createProject(x => {
          x.Loan_LoanEndDate__c = null;
        });

        const { loanEndDate } = mapToProjectDto(context, salesforce, ProjectRolePermissionBits.Unknown);

        expect(loanEndDate).toStrictEqual(null);
      });
    });

    describe("with loanAvailabilityPeriodLength", () => {
      it("with value", () => {
        const context = new TestContext();

        const salesforce = context.testData.createProject(x => {
          x.Loan_LoanAvailabilityPeriodLength__c = 1;
        });

        const { loanAvailabilityPeriodLength } = mapToProjectDto(
          context,
          salesforce,
          ProjectRolePermissionBits.Unknown,
        );

        expect(loanAvailabilityPeriodLength).toBe(1);
      });

      it("without value", () => {
        const context = new TestContext();

        const salesforce = context.testData.createProject(x => {
          x.Loan_LoanAvailabilityPeriodLength__c = null;
        });

        const { loanAvailabilityPeriodLength } = mapToProjectDto(
          context,
          salesforce,
          ProjectRolePermissionBits.Unknown,
        );

        expect(loanAvailabilityPeriodLength).toBeNull();
      });
    });

    describe("with loanExtensionPeriodLength", () => {
      it("with value", () => {
        const context = new TestContext();

        const salesforce = context.testData.createProject(x => {
          x.Loan_LoanExtensionPeriodLength__c = 1;
        });

        const { loanExtensionPeriodLength } = mapToProjectDto(context, salesforce, ProjectRolePermissionBits.Unknown);

        expect(loanExtensionPeriodLength).toBe(1);
      });

      it("without value", () => {
        const context = new TestContext();

        const salesforce = context.testData.createProject(x => {
          x.Loan_LoanExtensionPeriodLength__c = null;
        });

        const { loanExtensionPeriodLength } = mapToProjectDto(context, salesforce, ProjectRolePermissionBits.Unknown);

        expect(loanExtensionPeriodLength).toBeNull();
      });
    });

    describe("with loanRepaymentPeriodLength", () => {
      it("with value", () => {
        const context = new TestContext();

        const salesforce = context.testData.createProject(x => {
          x.Loan_LoanRepaymentPeriodLength__c = 1;
        });

        const { loanRepaymentPeriodLength } = mapToProjectDto(context, salesforce, ProjectRolePermissionBits.Unknown);

        expect(loanRepaymentPeriodLength).toBe(1);
      });

      it("without value", () => {
        const context = new TestContext();

        const salesforce = context.testData.createProject(x => {
          x.Loan_LoanRepaymentPeriodLength__c = null;
        });

        const { loanRepaymentPeriodLength } = mapToProjectDto(context, salesforce, ProjectRolePermissionBits.Unknown);

        expect(loanRepaymentPeriodLength).toBeNull();
      });
    });

    describe("with Impact Management Participation", () => {
      test.each([
        ["Yes", ImpactManagementParticipation.Yes],
        ["No", ImpactManagementParticipation.No],
        ["adskjhdas", ImpactManagementParticipation.Unknown],
        [null, ImpactManagementParticipation.Unknown],
      ])("with a $0 value", (input, expected) => {
        const context = new TestContext();

        const salesforce = context.testData.createProject(x => {
          x.Impact_Management_Participation__c = input as string;
        });

        const { impactManagementParticipation } = mapToProjectDto(
          context,
          salesforce,
          ProjectRolePermissionBits.Unknown,
        );

        expect(impactManagementParticipation).toBe(expected);
      });
    });
  });
});
