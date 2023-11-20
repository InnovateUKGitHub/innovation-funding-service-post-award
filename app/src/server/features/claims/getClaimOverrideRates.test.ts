import { AwardRateOverrideTarget, AwardRateOverrideType } from "@framework/constants/awardRateOverride";
import { CostCategory } from "@framework/entities/costCategory";
import { TestContext } from "@tests/test-utils/testContextProvider";
import { GetClaimOverrideRates } from "./getClaimOverrideRates";

describe("GetClaimOverrideRates", () => {
  const projectId = "stub-project-id" as ProjectId;
  const partnerId = "stub-partner-id" as PartnerId;
  const periodNum = 1 as PeriodId;
  const nonFecClaimTotal = 1000;

  const setup = (isNonFecProject = false) => {
    const ctx = new TestContext();
    const awardRate = 75;

    const testData = ctx.testData;

    const project = testData.createProject(x => ((x.Id = projectId), (x.Acc_NonFEC__c = isNonFecProject)));
    const partner = testData.createPartner(project, x => ((x.id = partnerId), (x.awardRate = awardRate)));

    const costCategoryCreationFunctions = {
      standardCostCategory: () => {
        // Create a new cost category that is associated with the project.
        const stubCostCategory = testData.createCostCategory({
          competitionType: project.Acc_CompetitionType__c,
          organisationType: partner.organisationType,
        });
        testData.createProfileDetail(stubCostCategory, partner, periodNum);
        testData.createClaimDetail(
          project,
          stubCostCategory,
          partner,
          periodNum,
          x => (x.Acc_PeriodCostCategoryTotal__c = 2600),
        );

        return costCategoryCreationFunctions;
      },

      costCategoryWithOverride: (update?: Partial<CostCategory>, profileOverrideAwardRate?: number) => {
        const overrideAwardRateCostCategory = testData.createCostCategory({
          competitionType: project.Acc_CompetitionType__c,
          organisationType: partner.organisationType,
          ...update,
        });
        testData.createProfileDetail(overrideAwardRateCostCategory, partner, periodNum);
        testData.createProfileTotalCostCategory(
          overrideAwardRateCostCategory,
          partner,
          undefined,
          profileOverrideAwardRate,
        );
        testData.createClaimDetail(
          project,
          overrideAwardRateCostCategory,
          partner,
          periodNum,
          x => (x.Acc_PeriodCostCategoryTotal__c = nonFecClaimTotal),
        );

        return costCategoryCreationFunctions;
      },

      periodWithOverride: (periodId: number, profileOverrideAwardRate?: number) => {
        testData.createProfileTotalPeriod(partner, periodId, profileOverrideAwardRate);
        return costCategoryCreationFunctions;
      },

      ctx,
    };

    return costCategoryCreationFunctions;
  };

  describe("detects overridden cost categories or profiles", () => {
    it("should detect nothing with 1 non-overridden cost category", async () => {
      const { ctx } = setup().standardCostCategory();
      const result = await ctx.runQuery(new GetClaimOverrideRates(partnerId));
      expect(result).toEqual({ type: AwardRateOverrideType.NONE, overrides: [] });
    });

    it("should detect nothing with 3 non-overridden cost categories", async () => {
      const { ctx } = setup().standardCostCategory().standardCostCategory().standardCostCategory();
      const result = await ctx.runQuery(new GetClaimOverrideRates(partnerId));
      expect(result).toEqual({ type: AwardRateOverrideType.NONE, overrides: [] });
    });

    it("should detect with cost category override award rate", async () => {
      const { ctx } = setup()
        .standardCostCategory()
        .costCategoryWithOverride({ id: "Cost40" as CostCategoryId, name: "Cost 40", overrideAwardRate: 40 });
      const result = await ctx.runQuery(new GetClaimOverrideRates(partnerId));
      expect(result).toEqual({
        type: AwardRateOverrideType.BY_COST_CATEGORY,
        overrides: [
          {
            amount: 40,
            target: AwardRateOverrideTarget.ALL_PARTICIPANTS,
            costCategoryId: "Cost40" as CostCategoryId,
            costCategoryName: "Cost 40",
          },
        ],
      });
    });

    it("should detect with 2 cost category override award rates", async () => {
      const { ctx } = setup()
        .standardCostCategory()
        .costCategoryWithOverride({ id: "Cost40" as CostCategoryId, name: "Cost 40", overrideAwardRate: 40 })
        .costCategoryWithOverride({ id: "Cost10" as CostCategoryId, name: "Cost 10", overrideAwardRate: 10 });
      const result = await ctx.runQuery(new GetClaimOverrideRates(partnerId));
      expect(result).toEqual({
        type: AwardRateOverrideType.BY_COST_CATEGORY,
        overrides: [
          {
            amount: 40,
            target: AwardRateOverrideTarget.ALL_PARTICIPANTS,
            costCategoryId: "Cost40",
            costCategoryName: "Cost 40",
          },
          {
            amount: 10,
            target: AwardRateOverrideTarget.ALL_PARTICIPANTS,
            costCategoryId: "Cost10",
            costCategoryName: "Cost 10",
          },
        ],
      });
    });

    it("should detect with cost category profile override award rate", async () => {
      const { ctx } = setup()
        .standardCostCategory()
        .costCategoryWithOverride({ id: "Cost25" as CostCategoryId, name: "Cost 25" }, 25);
      const result = await ctx.runQuery(new GetClaimOverrideRates(partnerId));
      expect(result).toEqual({
        type: AwardRateOverrideType.BY_COST_CATEGORY,
        overrides: [
          {
            amount: 25,
            target: AwardRateOverrideTarget.THIS_PARTICIPANT,
            costCategoryId: "Cost25",
            costCategoryName: "Cost 25",
          },
        ],
      });
    });

    it("should detect with cost category profile rate overriding cost category rate", async () => {
      const { ctx } = setup()
        .standardCostCategory()
        .costCategoryWithOverride({ id: "Cost89" as CostCategoryId, name: "Cost 89", overrideAwardRate: 12 }, 89);
      const result = await ctx.runQuery(new GetClaimOverrideRates(partnerId));
      expect(result).toEqual({
        type: AwardRateOverrideType.BY_COST_CATEGORY,
        overrides: [
          {
            amount: 89,
            target: AwardRateOverrideTarget.THIS_PARTICIPANT,
            costCategoryId: "Cost89",
            costCategoryName: "Cost 89",
          },
        ],
      });
    });

    it("should detect with 2 period profile override award rates", async () => {
      const { ctx } = setup().standardCostCategory().periodWithOverride(1, 30).periodWithOverride(2, 50);

      const result = await ctx.runQuery(new GetClaimOverrideRates(partnerId));
      expect(result).toEqual({
        type: AwardRateOverrideType.BY_PERIOD,
        overrides: [
          { amount: 30, target: AwardRateOverrideTarget.THIS_PARTICIPANT, period: 1 },
          { amount: 50, target: AwardRateOverrideTarget.THIS_PARTICIPANT, period: 2 },
        ],
      });
    });

    it("should detect with period profile override award rate", async () => {
      const { ctx } = setup().standardCostCategory().periodWithOverride(1, 40);
      const result = await ctx.runQuery(new GetClaimOverrideRates(partnerId));
      expect(result).toEqual({
        type: AwardRateOverrideType.BY_PERIOD,
        overrides: [{ amount: 40, target: AwardRateOverrideTarget.THIS_PARTICIPANT, period: 1 }],
      });
    });

    it("should detect with a 0% period rate", async () => {
      const { ctx } = setup().standardCostCategory().periodWithOverride(1, 0);
      const result = await ctx.runQuery(new GetClaimOverrideRates(partnerId));
      expect(result).toEqual({
        type: AwardRateOverrideType.BY_PERIOD,
        overrides: [{ amount: 0, target: AwardRateOverrideTarget.THIS_PARTICIPANT, period: 1 }],
      });
    });
  });

  it("should disallow simultaneous cost category and period based overrides", async () => {
    const { ctx } = setup()
      .standardCostCategory()
      .standardCostCategory()
      .costCategoryWithOverride({ id: "abcdefg" as CostCategoryId, name: "Neil Little", overrideAwardRate: 10 })
      .periodWithOverride(4, 50);

    const query = async () => {
      // Attempt to get the claim override rates for this project
      await ctx.runQuery(new GetClaimOverrideRates(partnerId));
    };

    // Expect it to crash because you cannot have both cost category overrides, and period overrides.
    await expect(query()).rejects.toThrow();
  });
});
