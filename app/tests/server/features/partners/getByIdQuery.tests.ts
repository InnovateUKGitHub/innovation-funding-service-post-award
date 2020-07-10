// tslint:disable:no-identical-functions no-duplicate-string
import { TestContext } from "../../testContextProvider";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { SalesforceProjectRole } from "@server/repositories";
import { PartnerClaimStatus, PartnerDto, PartnerStatus, ProjectRole, SpendProfileStatus } from "@framework/types";

describe("getAllForProjectQuery", () => {
  it("when partner exists is mapped to DTO", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();

    const partner = context.testData.createPartner(project, x => {
      x.name = "Expected name";
      x.totalParticipantCosts = 125000;
      x.totalApprovedCosts = 17474;
      x.totalPaidCosts = 25555;
      x.awardRate = 50;
      x.projectRole = SalesforceProjectRole.ProjectLead;
      x.projectRoleName = SalesforceProjectRole.ProjectLead;
      x.capLimit = 50;
      x.totalFutureForecastsForParticipant = 1002;
      x.claimsForReview = 10;
      x.claimsUnderQuery = 20;
      x.claimsOverdue = 30;
      x.trackingClaims = "Claim Due";
      x.participantStatus = "On Hold";
      x.overheadRate = 75;
      x.totalCostsSubmitted = 100;
      x.auditReportFrequencyName = "Never, for this project";
      x.totalCostsAwarded = 100000;
      x.totalPrepayment = 500;
      x.spendProfileStatus = "Complete";
    });

    const projectManger = context.testData.createProjectManager(project, partner);
    context.user.set({ email: projectManger.Acc_ContactId__r.Email });

    const result = await context.runQuery(new GetByIdQuery(partner.id));

    expect(result).not.toBe(null);

    const expected: PartnerDto = {
      id: "Partner1",
      name: "Expected name",
      accountId: "AccountId1",
      type: "Accedemic",
      postcode: "BS1 1AA",
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
      claimStatus: PartnerClaimStatus.ClaimDue,
      statusName: "Claim Due",
      overheadRate: 75,
      auditReportFrequencyName: "Never, for this project",
      partnerStatus: PartnerStatus.OnHold,
      isWithdrawn: false,
      totalCostsAwarded: 100000,
      totalPrepayment: 500,
      totalFundingDueToReceive: 62500,
      percentageParticipantCostsSubmitted: 0.08,
      newForecastNeeded: false,
      spendProfileStatus: SpendProfileStatus.Complete,
    };

    expect(result).toEqual(expected);
  });

  it("sets isWithdrawn correctly", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partnerInvoluntaryWithdrawal = context.testData.createPartner(project, x => {x.participantStatus = "Involuntary Withdrawal";});
    const partnerVoluntaryWithdrawal = context.testData.createPartner(project, x => {x.participantStatus = "Voluntary Withdrawal";});
    const partnerActive = context.testData.createPartner(project, x => {x.participantStatus = "Active";});
    expect((await context.runQuery(new GetByIdQuery(partnerInvoluntaryWithdrawal.id))).isWithdrawn).toBe(true);
    expect((await context.runQuery(new GetByIdQuery(partnerVoluntaryWithdrawal.id))).isWithdrawn).toBe(true);
    expect((await context.runQuery(new GetByIdQuery(partnerActive.id))).isWithdrawn).toBe(false);
  });

  it("calculated cost claimed percentage", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, x => {
      x.name = "Expected name";
      x.totalParticipantCosts = 10000;
      x.totalApprovedCosts = 1000;
      x.awardRate = 50;
      x.capLimit = 50;
    });

    const projectManger = context.testData.createProjectManager(project);
    context.user.set({ email: projectManger.Acc_ContactId__r.Email });

    const result = (await context.runQuery(new GetByIdQuery(partner.id)));

    expect(result.percentageParticipantCostsClaimed).toBe(10);
  });

  it("calculated cost claimed percentage is 0 when totalParticipantGrant is null", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, x => {
      x.name = "Expected name";
      x.totalParticipantCosts = null!;
      x.totalApprovedCosts = 1000;
      x.awardRate = 50;
      x.capLimit = 50;
    });

    const projectManger = context.testData.createProjectManager(project);
    context.user.set({ email: projectManger.Acc_ContactId__r.Email });

    const result = (await context.runQuery(new GetByIdQuery(partner.id)));

    expect(result.percentageParticipantCostsClaimed).toBe(null);
  });

  it("calculated cost claimed percentage is 0 when nothing clamed", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, x => {
      x.name = "Expected name";
      x.totalParticipantCosts = 10000;
      x.totalApprovedCosts = null as any;
      x.awardRate = 50;
      x.capLimit = 50;
    });

    const projectManger = context.testData.createProjectManager(project);
    context.user.set({ email: projectManger.Acc_ContactId__r.Email });

    const result = (await context.runQuery(new GetByIdQuery(partner.id)));
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
      x.projectRole = SalesforceProjectRole.ProjectLead;
      x.projectRoleName = SalesforceProjectRole.ProjectLead;
    });

    const projectContact1 = context.testData.createFinanceContact(project, partner, x => x.Acc_ContactId__r.Email = "financecontact@test.com");
    const projectContact2 = context.testData.createProjectManager(project, partner, x => x.Acc_ContactId__r.Email = "projectManager@test.com");

    // now set user to the finance contact
    context.user.set({ email: projectContact1.Acc_ContactId__r.Email });

    const result1 = await context.runQuery(new GetByIdQuery(partner.id));
    expect(result1.roles).toBe(ProjectRole.FinancialContact);

    // now set user to the project manager
    context.user.set({ email: projectContact2.Acc_ContactId__r.Email });

    const result2 = await context.runQuery(new GetByIdQuery(partner.id));
    expect(result2.roles).toBe(ProjectRole.ProjectManager);
  });
});
