import { TestContext } from "../../testContextProvider";
import { GetCostsSummaryForPeriodQuery } from "@server/features/claimDetails";
import { Authorisation, ProjectRole } from "@framework/types";

// tslint:disable-next-line:no-big-function
describe("GetCostSummaryForPeriodQuery", () => {
  it("when valid then returns all cost categories", async () => {
    const context = new TestContext();

    const partner = context.testData.createPartner();
    const costCategories = context.testData.range(5, _ => context.testData.createCostCategory({ organisationType: "Industrial" }));

    const project = context.testData.createProject();

    costCategories.forEach(x => {
      context.testData.createClaimDetail(project, x, partner, 1);
    });

    const query = new GetCostsSummaryForPeriodQuery(project.Id, partner.id, 1);

    const result = await context.runQuery(query);

    expect(result.length).toBe(5);
  });

  it("should return the claim details in correct cost category order", async () => {
    const context = new TestContext();

    const partner = context.testData.createPartner();
    const costCategories = context.testData.range(5, (_, i) => context.testData.createCostCategory({
      organisationType: "Industrial",
      displayOrder: 5 - i,
      id: `costCategory_${5 - i}`,
    }));

    const project = context.testData.createProject();

    costCategories.forEach(x => {
      context.testData.createClaimDetail(project, x, partner, 1);
    });

    const query = new GetCostsSummaryForPeriodQuery(project.Id, partner.id, 1);

    const result = await context.runQuery(query);

    expect(result.map(x => x.costCategoryId)).toEqual(["costCategory_1", "costCategory_2", "costCategory_3", "costCategory_4", "costCategory_5"]);
  });

  it("only returns cost categories for existing claims", async () => {
    const context = new TestContext();

    const partner = context.testData.createPartner();
    context.testData.range(3, _ => context.testData.createCostCategory({ organisationType: "Academic" }));
    const costCategories = context.testData.range(5, _ => context.testData.createCostCategory({ organisationType: "Industrial"}));

    const project = context.testData.createProject();

    costCategories.forEach(x => {
      context.testData.createClaimDetail(project, x, partner, 1);
    });

    const query = new GetCostsSummaryForPeriodQuery(project.Id, partner.id, 1);

    const result = await context.runQuery(query);

    expect(result.length).toBe(5);
  });

  it("should return correct remaining offer costs for a cost category", async () => {
    const context = new TestContext();

    const expectedCost = 25000;

    const costCategory = context.testData.createCostCategory({ organisationType: "Industrial" });
    const partner = context.testData.createPartner();
    const periodId = 1;

    const project = context.testData.createProject();

    context.testData.createClaimDetail(project, costCategory, partner, periodId, x => x.Acc_PeriodCostCategoryTotal__c = expectedCost);

    const query = new GetCostsSummaryForPeriodQuery(project.Id, partner.id, periodId);

    const result = await context.runQuery(query);

    expect(result.length).toBe(1);
    expect(result[0].costCategoryId).toBe(costCategory.id);
    expect(result[0].costsClaimedThisPeriod).toBe(expectedCost);
  });

  it("should correctly filter cost categories", async () => {
    const context = new TestContext();

    const expectedCost1 = 25000;
    const expectedCost2 = 35000;

    const costCategory1 = context.testData.createCostCategory({ organisationType: "Industrial" });
    const costCategory2 = context.testData.createCostCategory({ organisationType: "Industrial" });

    const partner = context.testData.createPartner();
    const periodId = 1;

    const project = context.testData.createProject();

    context.testData.createClaimDetail(project, costCategory1, partner, periodId, x => x.Acc_PeriodCostCategoryTotal__c = expectedCost1);
    context.testData.createClaimDetail(project, costCategory2, partner, periodId, x => x.Acc_PeriodCostCategoryTotal__c = expectedCost2);

    const query = new GetCostsSummaryForPeriodQuery(project.Id, partner.id, periodId);

    const result = await context.runQuery(query);

    expect(result.length).toBe(2);
    expect(result[0].costCategoryId).toBe(costCategory1.id);
    expect(result[0].costsClaimedThisPeriod).toBe(expectedCost1);

    expect(result[1].costCategoryId).toBe(costCategory2.id);
    expect(result[1].costsClaimedThisPeriod).toBe(expectedCost2);
  });

  it("should return correct cost category offer costs", async () => {
    const context = new TestContext();
    const periodId = 1;
    const partner = context.testData.createPartner();
    const project = context.testData.createProject();
    const costCategory = context.testData.createCostCategory();
    const totalValue = 1234;
    const forecastValue = 123;
    const claimValue = 1200;

    context.testData.createProfileTotalCostCategory(costCategory, partner, totalValue);
    context.testData.createProfileDetail(costCategory, partner, periodId, x => x.Acc_LatestForecastCost__c = forecastValue);
    context.testData.createClaimDetail(project, costCategory, partner, periodId, x => x.Acc_PeriodCostCategoryTotal__c = claimValue);

    const query = new GetCostsSummaryForPeriodQuery(project.Id, partner.id, periodId);
    const result = await context.runQuery(query);

    expect(result[0].offerTotal).toBe(totalValue);
    expect(result[0].forecastThisPeriod).toBe(forecastValue);
    expect(result[0].costsClaimedThisPeriod).toBe(claimValue);
    expect(result[0].costsClaimedToDate).toBe(0);
    expect(result[0].remainingOfferCosts).toBe(totalValue - claimValue);
  });

  it("should default cost claimed to date to 0", async () => {
    const context = new TestContext();
    const periodId = 1;
    const partner = context.testData.createPartner();
    const project = context.testData.createProject();
    const costCategory = context.testData.createCostCategory();

    context.testData.createClaimDetail(project, costCategory, partner, periodId, x => x.Acc_PeriodCostCategoryTotal__c = null!);

    const query = new GetCostsSummaryForPeriodQuery(project.Id, partner.id, periodId);
    const result = await context.runQuery(query);

    expect(result[0].costsClaimedToDate).toBe(0);
  });

  it("should return correct cost claimed to date for cost category", async () => {
    const context = new TestContext();
    const periodId1 = 1;
    const periodId2 = 2;
    const partner = context.testData.createPartner();
    const project = context.testData.createProject();
    const costCategory = context.testData.createCostCategory();

    context.testData.createClaimDetail(project, costCategory, partner, periodId1, x => x.Acc_PeriodCostCategoryTotal__c = 1234);
    context.testData.createClaimDetail(project, costCategory, partner, periodId2, x => x.Acc_PeriodCostCategoryTotal__c = 3456);

    const query = new GetCostsSummaryForPeriodQuery(project.Id, partner.id, periodId2);
    const result = await context.runQuery(query);

    expect(result[0].costsClaimedToDate).toBe(1234);
  });

  test("Should return all cost categoried event if no details", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);

    const expectedCostCategories = context.testData.range(3, i => context.testData.createCostCategory({
      competitionType: project.Acc_CompetitionType__c,
      organisationType: partner.organisationType,
    }));

    // not expected cost categories as diff org
    context.testData.range(3, i => context.testData.createCostCategory({
      competitionType: project.Acc_CompetitionType__c,
      organisationType: partner.organisationType + "_",
    }));

    // not expected cost categories as diff comp
    context.testData.range(3, i => context.testData.createCostCategory({
      competitionType: project.Acc_CompetitionType__c + "_",
      organisationType: partner.organisationType,
    }));

    const query = new GetCostsSummaryForPeriodQuery(project.Id, partner.id, 1);
    const result = await context.runQuery(query);

    expect(result.map(x => x.costCategoryId)).toEqual(expectedCostCategories.map(x => x.id));

  });

  test("accessControl - Partner Financial Contact passes", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const periodId = 1;

    const query = new GetCostsSummaryForPeriodQuery(project.Id, partner.id, periodId);
    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.Unknown,
        partnerRoles: { [partner.id]: ProjectRole.FinancialContact }
      }
    });

    expect(await context.runAccessControl(auth, query)).toBe(true);
  });

  test("accessControl - Project Manager passes", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const periodId = 1;
    const query = new GetCostsSummaryForPeriodQuery(project.Id, partner.id, periodId);
    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.ProjectManager,
        partnerRoles: {}
      }
    });

    expect(await context.runAccessControl(auth, query)).toBe(true);
  });

  test("accessControl - Project Monitoring Officer passes", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const periodId = 1;

    const query = new GetCostsSummaryForPeriodQuery(project.Id, partner.id, periodId);
    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.MonitoringOfficer,
        partnerRoles: {}
      }
    });

    expect(await context.runAccessControl(auth, query)).toBe(true);
  });

  test("accessControl - Project Unkown fails", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const periodId = 1;

    const query = new GetCostsSummaryForPeriodQuery(project.Id, partner.id, periodId);
    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.Unknown,
        partnerRoles: {}
      }
    });

    expect(await context.runAccessControl(auth, query)).toBe(false);
  });

  test("accessControl - Project Financial Contact fails", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const partner = context.testData.createPartner();
    const periodId = 1;

    const query = new GetCostsSummaryForPeriodQuery(project.Id, partner.id, periodId);
    const auth = new Authorisation({
      [project.Id]: {
        projectRoles: ProjectRole.FinancialContact,
        partnerRoles: {}
      }
    });

    expect(await context.runAccessControl(auth, query)).toBe(false);
  });
});
