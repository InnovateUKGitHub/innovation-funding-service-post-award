// tslint:disable:no-identical-functions no-duplicate-string
import { TestContext } from "../../testContextProvider";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { SalesforceProjectRole } from "@server/repositories";
import { PartnerClaimStatus, PartnerDto, PartnerStatus, ProjectRole } from "@framework/types";

describe("getAllForProjectQuery", () => {
  it("when partner exists is mapped to DTO", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();

    const partner = context.testData.createPartner(project, x => {
      x.Acc_AccountId__r.Name = "Expected name";
      x.Acc_TotalParticipantCosts__c = 125000;
      x.Acc_TotalApprovedCosts__c = 17474;
      x.Acc_TotalPaidCosts__c = 25555;
      x.Acc_Award_Rate__c = 50;
      x.Acc_ProjectRole__c = SalesforceProjectRole.ProjectLead;
      x.ProjectRoleName = SalesforceProjectRole.ProjectLead;
      x.Acc_Cap_Limit__c = 50;
      x.Acc_TotalFutureForecastsForParticipant__c = 1002;
      x.Acc_ClaimsForReview__c = 10;
      x.Acc_ClaimsUnderQuery__c = 20;
      x.Acc_ClaimsOverdue__c = 30;
      x.Acc_TrackingClaims__c = "Claim Due";
      x.Acc_ParticipantStatus__c = "On Hold";
      x.Acc_OverheadRate__c = 75;
      x.Acc_TotalCostsSubmitted__c = 100;
      x.AuditReportFrequencyName = "Never, for this project";
      x.Acc_TotalCostsAwarded__c = 100000;
      x.Acc_TotalPrepayment__c = 500;
    });

    const projectManger = context.testData.createProjectManager(project, partner);
    context.user.set({ email: projectManger.Acc_ContactId__r.Email });

    const result = await context.runQuery(new GetByIdQuery(partner.Id));

    expect(result).not.toBe(null);

    const expected: PartnerDto = {
      id: "Partner1",
      name: "Expected name",
      accountId: "AccountId1",
      type: "Accedemic",
      isLead: true,
      projectRoleName: "Lead",
      projectId: "Project1",
      organisationType: "Industrial",
      competitionType: "SBRI",
      totalPaidCosts: 25555,
      totalParticipantGrant: 125000,
      totalParticipantCostsClaimed: 17474,
      percentageParticipantCostsClaimed: 13.9792,
      awardRate: 50,
      capLimit: 50,
      totalFutureForecastsForParticipants: 1002,
      totalCostsSubmitted: 100,
      roles: ProjectRole.ProjectManager,
      forecastLastModifiedDate: null,
      claimsWithParticipant: 20,
      claimsOverdue: 30,
      status: PartnerClaimStatus.ClaimDue,
      statusName: "Claim Due",
      overheadRate: 75,
      auditReportFrequencyName: "Never, for this project",
      partnerStatus: PartnerStatus.OnHold,
      totalCostsAwarded: 100000,
      totalPrepayment: 500,
      totalFundingDueToReceive: 62500,
      percentageParticipantCostsSubmitted: 0.08
    };

    expect(result).toEqual(expected);
  });

  it("calculated cost claimed percentage", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, x => {
      x.Acc_AccountId__r.Name = "Expected name";
      x.Acc_TotalParticipantCosts__c = 10000;
      x.Acc_TotalApprovedCosts__c = 1000;
      x.Acc_Award_Rate__c = 50;
      x.Acc_Cap_Limit__c = 50;
    });

    const projectManger = context.testData.createProjectManager(project);
    context.user.set({ email: projectManger.Acc_ContactId__r.Email });

    const result = (await context.runQuery(new GetByIdQuery(partner.Id)));

    expect(result.percentageParticipantCostsClaimed).toBe(10);
  });

  it("calculated cost claimed percentage is 0 when totalParticipantGrant is null", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, x => {
      x.Acc_AccountId__r.Name = "Expected name";
      x.Acc_TotalParticipantCosts__c = null!;
      x.Acc_TotalApprovedCosts__c = 1000;
      x.Acc_Award_Rate__c = 50;
      x.Acc_Cap_Limit__c = 50;
    });

    const projectManger = context.testData.createProjectManager(project);
    context.user.set({ email: projectManger.Acc_ContactId__r.Email });

    const result = (await context.runQuery(new GetByIdQuery(partner.Id)));

    expect(result.percentageParticipantCostsClaimed).toBe(null);
  });

  it("calculated cost claimed percentage is 0 when nothing clamed", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, x => {
      x.Acc_AccountId__r.Name = "Expected name";
      x.Acc_TotalParticipantCosts__c = 10000;
      x.Acc_TotalApprovedCosts__c = null as any;
      x.Acc_Award_Rate__c = 50;
      x.Acc_Cap_Limit__c = 50;
    });

    const projectManger = context.testData.createProjectManager(project);
    context.user.set({ email: projectManger.Acc_ContactId__r.Email });

    const result = (await context.runQuery(new GetByIdQuery(partner.Id)));
    expect(result.percentageParticipantCostsClaimed).toBe(0);
  });

  it("when partner doesn't exist", async () => {
    const context = new TestContext();
    await expect(context.runQuery(new GetByIdQuery("fakePartnerId"))).rejects.toThrow();
  });

  // @TODO: Separate into two different tests
  it("when user is finance contact expect role set", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, x => {
      x.Acc_ProjectRole__c = SalesforceProjectRole.ProjectLead;
      x.ProjectRoleName = SalesforceProjectRole.ProjectLead;
    });

    const projectContact1 = context.testData.createFinanceContact(project, partner, x => x.Acc_ContactId__r.Email = "financecontact@test.com");
    const projectContact2 = context.testData.createProjectManager(project, partner, x => x.Acc_ContactId__r.Email = "projectManager@test.com");

    // now set user to the finance contact
    context.user.set({ email: projectContact1.Acc_ContactId__r.Email });

    const result1 = await context.runQuery(new GetByIdQuery(partner.Id));
    expect(result1.roles).toBe(ProjectRole.FinancialContact);

    // now set user to the project manager
    context.user.set({ email: projectContact2.Acc_ContactId__r.Email });

    const result2 = await context.runQuery(new GetByIdQuery(partner.Id));
    expect(result2.roles).toBe(ProjectRole.ProjectManager);
  });
});
