import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import {
  BankCheckStatus,
  BankDetailsTaskStatus,
  PartnerClaimStatus,
  PartnerDto,
  PartnerStatus,
  PostcodeTaskStatus,
  ProjectRole,
  SpendProfileStatus,
} from "@framework/types";
import { SalesforceProjectRole } from "@server/constants/enums";
import { TestContext } from "@tests/test-utils/testContextProvider";

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
      x.competitionType = "SBRI";
      x.trackingClaims = "Claim Due";
      x.participantStatus = "On Hold";
      x.participantStatusLabel = "On Hold";
      x.overheadRate = 75;
      x.totalCostsSubmitted = 100;
      x.auditReportFrequencyName = "Never, for this project";
      x.totalCostsAwarded = 100000;
      x.totalPrepayment = 500;
      x.spendProfileStatus = "Complete";
      x.spendProfileStatusLabel = "Complete";
      x.bankDetailsTaskStatus = "Todo";
      x.bankDetailsTaskStatusLabel = "To do";
      x.bankCheckStatus = "BankCheckStatus.Todo";
      x.firstName = "Mr";
      x.lastName = "Toad";
      x.accountPostcode = "TH1 0WW";
      x.accountStreet = "Main Street";
      x.accountBuilding = "Toad Hall";
      x.accountLocality = "Local";
      x.accountTownOrCity = "Berkshire";
      x.accountNumber = "001122";
      x.sortCode = "005566";
      x.companyNumber = "123344";
      x.validationCheckPassed = false;
      x.iban = "123454321";
      x.validationConditionsSeverity = "Warning";
      x.validationConditionsCode = "2";
      x.validationConditionsDesc = "A warning about a validation thing";
      x.addressScore = 6;
      x.companyNameScore = 5;
      x.personalDetailsScore = 4;
      x.regNumberScore = "Match";
      x.verificationConditionsSeverity = "Warning";
      x.verificationConditionsCode = "2";
      x.verificationConditionsDesc = "A warning about a verification thing";
      x.totalGrantApproved = 1234.54;
      x.remainingParticipantGrant = 4321.12;
      x.isNonFunded = true;
    });

    const projectManger = context.testData.createProjectManager(project, partner);
    context.user.set({ email: projectManger.Acc_ContactId__r.Email });

    const result = await context.runQuery(new GetByIdQuery(partner.id));

    expect(result).not.toBe(null);

    const expected: PartnerDto = {
      id: "Partner1",
      name: "Expected name",
      accountId: "AccountId1",
      type: "Academic",
      postcode: "BS1 1AA",
      postcodeStatusLabel: "",
      postcodeStatus: PostcodeTaskStatus.Complete,
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
      overdueProject: false,
      claimsOverdue: 30,
      claimStatus: PartnerClaimStatus.ClaimDue,
      statusName: "Claim Due",
      overheadRate: 75,
      auditReportFrequencyName: "Never, for this project",
      partnerStatus: PartnerStatus.OnHold,
      partnerStatusLabel: "On Hold",
      isWithdrawn: false,
      totalCostsAwarded: 100000,
      totalPrepayment: 500,
      totalFundingDueToReceive: 62500,
      percentageParticipantCostsSubmitted: 0.08,
      newForecastNeeded: false,
      spendProfileStatus: SpendProfileStatus.Complete,
      spendProfileStatusLabel: "Complete",
      totalGrantApproved: 1234.54,
      remainingParticipantGrant: 4321.12,
      bankDetailsTaskStatus: BankDetailsTaskStatus.Unknown,
      bankDetailsTaskStatusLabel: "To do",
      bankCheckStatus: BankCheckStatus.Unknown,
      bankCheckRetryAttempts: 0,
      bankDetails: {
        accountNumber: "001122",
        sortCode: "005566",
        companyNumber: "123344",
        firstName: "Mr",
        lastName: "Toad",
        address: {
          accountPostcode: "TH1 0WW",
          accountStreet: "Main Street",
          accountBuilding: "Toad Hall",
          accountLocality: "Local",
          accountTownOrCity: "Berkshire",
        },
      },
      validationResponse: {
        validationCheckPassed: false,
        iban: "123454321",
        validationConditionsSeverity: "Warning",
        validationConditionsCode: "2",
        validationConditionsDesc: "A warning about a validation thing",
      },
      verificationResponse: {
        addressScore: 6,
        companyNameScore: 5,
        personalDetailsScore: 4,
        regNumberScore: "Match",
        verificationConditionsSeverity: "Warning",
        verificationConditionsCode: "2",
        verificationConditionsDesc: "A warning about a verification thing",
      },
      isNonFunded: true,
    };

    expect(result).toEqual(expected);
  });

  describe("sets overdueProject correctly", () => {
    test.each`
      name                                                    | overdueState | participantStatus         | expectedState
      ${"when not overdue with a valid status"}               | ${false}     | ${"On Hold"}              | ${false}
      ${"when not overdue with an invalid status"}            | ${false}     | ${"Active"}               | ${false}
      ${"when overdue with a status of Voluntary Withdrawal"} | ${true}      | ${"Voluntary Withdrawal"} | ${false}
      ${"when overdue with a status of Active"}               | ${true}      | ${"Active"}               | ${false}
      ${"when overdue with a status of On Hold"}              | ${true}      | ${"On Hold"}              | ${true}
    `("$name", async ({ overdueState, participantStatus, expectedState }) => {
      const context = new TestContext();
      const project = context.testData.createProject();

      const { id } = context.testData.createPartner(project, x => {
        x.overdueProject = overdueState;
        x.participantStatus = participantStatus;
      });

      const expectedPartner = await context.runQuery(new GetByIdQuery(id));

      expect(expectedPartner.overdueProject).toBe(expectedState);
    });
  });

  it("sets isWithdrawn correctly", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partnerInvoluntaryWithdrawal = context.testData.createPartner(project, x => {
      x.participantStatus = "Involuntary Withdrawal";
    });
    const partnerVoluntaryWithdrawal = context.testData.createPartner(project, x => {
      x.participantStatus = "Voluntary Withdrawal";
    });
    const partnerActive = context.testData.createPartner(project, x => {
      x.participantStatus = "Active";
    });
    expect((await context.runQuery(new GetByIdQuery(partnerInvoluntaryWithdrawal.id))).isWithdrawn).toBe(true);
    expect((await context.runQuery(new GetByIdQuery(partnerVoluntaryWithdrawal.id))).isWithdrawn).toBe(true);
    expect((await context.runQuery(new GetByIdQuery(partnerActive.id))).isWithdrawn).toBe(false);
  });

  describe("with competitionName", () => {
    it("with undefined value", async () => {
      const context = new TestContext();
      const project = context.testData.createProject();

      const partnerNoCompetitionName = context.testData.createPartner(project);
      const queriedPartner = await context.runQuery(new GetByIdQuery(partnerNoCompetitionName.id));

      expect(queriedPartner.competitionName).toBeUndefined();
    });

    it("with defined value", async () => {
      const stubCompetitionName = "stub-competitionName";

      const context = new TestContext();
      const project = context.testData.createProject();

      const partnerWithCompetitionName = context.testData.createPartner(project, x => {
        x.competitionName = stubCompetitionName;
      });
      const queriedPartner = await context.runQuery(new GetByIdQuery(partnerWithCompetitionName.id));

      expect(queriedPartner.competitionName).toBe(stubCompetitionName);
    });
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

    const result = await context.runQuery(new GetByIdQuery(partner.id));

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

    const result = await context.runQuery(new GetByIdQuery(partner.id));

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

    const result = await context.runQuery(new GetByIdQuery(partner.id));
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

    const projectContact1 = context.testData.createFinanceContact(
      project,
      partner,
      x => (x.Acc_ContactId__r.Email = "financecontact@test.com"),
    );
    const projectContact2 = context.testData.createProjectManager(
      project,
      partner,
      x => (x.Acc_ContactId__r.Email = "projectManager@test.com"),
    );

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
