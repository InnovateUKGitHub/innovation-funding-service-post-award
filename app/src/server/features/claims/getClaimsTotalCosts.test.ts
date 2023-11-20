import { GetClaimsTotalCosts } from "@server/features/claims/getClaimsTotalCosts";
import { TestContext } from "@tests/test-utils/testContextProvider";

describe("GetClaimsTotalCosts", () => {
  const projectId = "stub-project-id" as ProjectId;
  const partnerId = "stub-partner-id" as PartnerId;
  const periodNum = 1 as PeriodId;
  const nonFecClaimTotal = 1000;

  const setup = (context: TestContext, awardRate: number, isNonFecProject: boolean, overrideAwardRate?: number) => {
    const testData = context.testData;

    const project = testData.createProject(x => ((x.Id = projectId), (x.Acc_NonFEC__c = isNonFecProject)));
    const partner = testData.createPartner(project, x => ((x.id = partnerId), (x.awardRate = awardRate)));

    // Create a new cost category that is associated with the project.
    const stubCostCategory = testData.createCostCategory({
      competitionType: project.Acc_CompetitionType__c,
      organisationType: partner.organisationType,
    });
    testData.createProfileDetail(stubCostCategory, partner, periodNum);
    testData.createProfileTotalCostCategory(stubCostCategory, partner);
    testData.createClaimDetail(
      project,
      stubCostCategory,
      partner,
      periodNum,
      x => (x.Acc_PeriodCostCategoryTotal__c = 2600),
    );

    // Create a second cost category that should be awarded at a different award rate
    if (isNonFecProject) {
      const overrideAwardRateCostCategory = testData.createCostCategory({
        competitionType: project.Acc_CompetitionType__c,
        organisationType: partner.organisationType,
        overrideAwardRate: overrideAwardRate ?? 100,
      });
      testData.createProfileDetail(overrideAwardRateCostCategory, partner, periodNum);
      testData.createProfileTotalCostCategory(overrideAwardRateCostCategory, partner);
      testData.createClaimDetail(
        project,
        overrideAwardRateCostCategory,
        partner,
        periodNum,
        x => (x.Acc_PeriodCostCategoryTotal__c = nonFecClaimTotal),
      );
    }
  };

  describe.each`
    name                 | isNonFecProject
    ${"FEC project"}     | ${false}
    ${"non-FEC project"} | ${true}
  `("as $name", ({ isNonFecProject }) => {
    test.each`
      name                      | awardRate | expectedValue
      ${"with no award rate"}   | ${0}      | ${0}
      ${"with 50% award rate"}  | ${50}     | ${1300}
      ${"with 75% award rate"}  | ${75}     | ${1950}
      ${"with 100% award rate"} | ${100}    | ${2600}
    `("$name", async ({ awardRate, expectedValue }) => {
      const context = new TestContext();
      setup(context, awardRate, isNonFecProject);

      const query = new GetClaimsTotalCosts(partnerId, projectId, periodNum);
      const result = await context.runQuery(query);

      const expectedTotalCosts = isNonFecProject ? 3600 : 2600;
      const expectedTotalCostsPaid = isNonFecProject ? expectedValue + nonFecClaimTotal : expectedValue;

      expect(result.totalCostsClaimed).toBe(expectedTotalCosts);
      expect(result.totalCostsPaid).toBe(expectedTotalCostsPaid);
    });
  });

  test("non-FEC project with 0% override award rate", async () => {
    const context = new TestContext();
    setup(context, 50, true, 0);

    const query = new GetClaimsTotalCosts(partnerId, projectId, periodNum);
    const result = await context.runQuery(query);

    expect(result.totalCostsClaimed).toBe(3600);
    expect(result.totalCostsPaid).toBe(1300);
  });
});
