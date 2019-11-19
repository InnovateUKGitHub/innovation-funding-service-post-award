// tslint:disable:no-identical-functions no-duplicate-string
import "jest";
import { TestContext } from "../../testContextProvider";
import { MapToProjectDtoCommand } from "@server/features/projects/mapToProjectDto";
import { ClaimFrequency, ProjectDto, ProjectRole, ProjectStatus } from "@framework/types";

describe("MapToProjectDtoCommand", () => {
  it("when valid expect mapping", async () => {
    const context = new TestContext();

    context.clock.setDate("2009/01/15");

    const startDate = context.clock.dateTime("2008-01-01", "yyyy-MM-dd");
    const endDate   = context.clock.dateTime("2010-12-31", "yyyy-MM-dd");

    const expected: ProjectDto = {
      id: "Expected Id",
      title: "Expected title",
      startDate: startDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toJSDate(),
      endDate: endDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toJSDate(),
      summary: "Expected summary",
      description: "Expected description",
      projectNumber: "Expected project number",
      competitionType: "SBRI",
      claimFrequency: ClaimFrequency.Quarterly,
      claimFrequencyName: ClaimFrequency[ClaimFrequency.Quarterly],
      periodId: 5,
      totalPeriods: 12,
      grantOfferLetterCosts: 2000,
      costsClaimedToDate: 1000,
      claimedPercentage: 50,
      periodStartDate: context.clock.parse("2009-01-01", "yyyy-MM-dd"),
      periodEndDate: context.clock.parse("2009-03-31", "yyyy-MM-dd"),
      roles: ProjectRole.Unknown,
      roleTitles: [],
      claimWindowStart: context.clock.parse("2009-01-01 00:00:00", "yyyy-MM-dd hh:mm:ss"),
      claimWindowEnd: context.clock.parse("2009-01-30 23:59:00", "yyyy-MM-dd hh:mm:ss"),
      claimsOverdue: 5,
      claimsWithParticipant: 1,
      claimsToReview: 2,
      status: ProjectStatus.Live,
      statusName: "Live",
      numberOfOpenClaims: 10,
      numberOfPeriods: 5,
      durationInMonths: 15,
      leadPartnerName: "Expected lead partner"
    };

    const salesforce = context.testData.createProject(x => {
      x.Id = expected.id;
      x.Acc_ProjectSummary__c = expected.summary;
      x.Acc_PublicDescription__c = expected.description;
      x.Acc_ProjectTitle__c = expected.title;
      x.Acc_StartDate__c = startDate.toFormat("yyyy-MM-dd");
      x.Acc_EndDate__c = endDate.toFormat("yyyy-MM-dd");
      x.Acc_ProjectNumber__c = expected.projectNumber;
      x.Acc_ClaimFrequency__c = "Quarterly";
      x.Acc_GOLTotalCostAwarded__c = expected.grantOfferLetterCosts;
      x.Acc_TotalProjectCosts__c = expected.costsClaimedToDate;
      x.Acc_ProjectStatus__c = expected.statusName;
      x.ProjectStatusName = expected.statusName;
      x.Acc_ClaimsOverdue__c = expected.claimsOverdue;
      x.Acc_ClaimsUnderQuery__c = expected.claimsWithParticipant;
      x.Acc_ClaimsForReview__c = expected.claimsToReview;
      x.Acc_NumberOfOpenClaims__c = expected.numberOfOpenClaims;
      x.Acc_NumberofPeriods__c = expected.numberOfPeriods;
      x.Acc_Duration__c = expected.durationInMonths;
      x.Acc_LeadParticipantName__c = expected.leadPartnerName;
    });

    const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));

    expect(result).toMatchObject(expected);
  });

  it("when ifs application url configured expect full url", async () => {
    const context = new TestContext();
    context.config.urls.ifsApplicationUrl = "https://ifs.application.url/application/competition/<<Acc_ProjectNumber__c>>/project/<<Acc_IFSApplicationId__c>>";

    const salesforce = context.testData.createProject(x => {
      x.Acc_ProjectSource__c = "IFS";
      x.Acc_IFSApplicationId__c = 1;
      x.Acc_ProjectNumber__c = "30000";
    });

    const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));

    expect(result.applicationUrl).toBe("https://ifs.application.url/application/competition/30000/project/1");
  });

  it("when ifs grant letter url configured expect full url", async () => {
    const context = new TestContext();
    context.config.urls.ifsGrantLetterUrl = "https://ifs.application.url/grantletter/competition/<<Acc_ProjectNumber__c>>/project/<<Acc_IFSApplicationId__c>>";

    const salesforce = context.testData.createProject(x => {
      x.Acc_ProjectSource__c = "IFS";
      x.Acc_IFSApplicationId__c = 1;
      x.Acc_ProjectNumber__c = "30000";
    });

    const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));

    expect(result.grantOfferLetterUrl).toBe("https://ifs.application.url/grantletter/competition/30000/project/1");
  });

  it("ClaimFrequency should map correct - Quarterly", async () => {
    const context = new TestContext();
    const salesforce = context.testData.createProject(x => {
      x.Acc_ClaimFrequency__c = "Quarterly";
    });
    const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));
    expect(result.claimFrequency).toBe(ClaimFrequency.Quarterly);
  });

  it("ClaimFrequency should map correct - Monthly", async () => {
    const context = new TestContext();
    const salesforce = context.testData.createProject(x => {
      x.Acc_ClaimFrequency__c = "Monthly";
    });
    const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));
    expect(result.claimFrequency).toBe(ClaimFrequency.Monthly);
  });

  it("ClaimFrequency should map correct - Unknown", async () => {
    const context = new TestContext();
    const salesforce = context.testData.createProject(x => {
      x.Acc_ClaimFrequency__c = "asd";
    });
    const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));
    expect(result.claimFrequency).toBe(ClaimFrequency.Unknown);
  });

  it("Period should calculate correct - Quarterly", async () => {
    const context = new TestContext();
    const salesforce = context.testData.createProject(x => {
      x.Acc_ClaimFrequency__c = "Quarterly";
      x.Acc_StartDate__c = "2018-01-01";
      x.Acc_EndDate__c = "2018-12-31";
    });

    for (let i = 1; i <= 12; i++) {
      const month = i < 10 ? `0${i}` : i;
      context.clock.setDate(`2018/${month}/01`);
      const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));
      const expected = Math.ceil(i / 3);
      expect(result.periodId).toBe(expected);
    }
  });

  it("Period should calculate correct - Monthly", async () => {
    const context = new TestContext();
    const salesforce = context.testData.createProject(x => {
      x.Acc_ClaimFrequency__c = "Monthly";
      x.Acc_StartDate__c = "2018-01-01";
      x.Acc_EndDate__c = "2018-12-31";
    });

    for (let i = 1; i <= 12; i++) {
      const month = i < 10 ? `0${i}` : i;
      context.clock.setDate(`2018/${month}/01`);
      const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));
      expect(result.periodId).toBe(i);
    }
  });

  it("Period should default when Unknown", async () => {
    const context = new TestContext();
    const salesforce = context.testData.createProject(x => {
      x.Acc_ClaimFrequency__c = "Monthly";
      x.Acc_StartDate__c = "2018-01-01";
      x.Acc_EndDate__c = "2018-12-31";
    });

    for (let i = 1; i <= 12; i++) {
      const month = i < 10 ? `0${i}` : i;
      context.clock.setDate(`2018/${month}/01`);
      const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));
      expect(result.periodId).toBe(i);
    }
  });

  it("Gol Costs should be returned", async () => {
    const context = new TestContext();

    const salesforce = context.testData.createProject(x => {
      x.Acc_GOLTotalCostAwarded__c = 100000;
    });

    const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));

    expect(result.grantOfferLetterCosts).toBe(100000);

  });

  it("Claimed Costs should be returned", async () => {
    const context = new TestContext();

    const salesforce = context.testData.createProject(x => {
      x.Acc_TotalProjectCosts__c = 500000;
    });

    const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));

    expect(result.costsClaimedToDate).toBe(500000);

  });
});
