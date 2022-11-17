import { QueryBase } from "@server/features/common";
import {
  ClaimOverrideRateDto,
  CostCategoryClaimOverrideRate,
  CostCategoryClaimOverrideRates,
  CostsSummaryForPeriodDto,
  IContext,
  PeriodClaimOverrideRates,
  PeriodClaimOverrideRate,
  TotalCosts,
} from "@framework/types";
import { roundCurrency, sumBy } from "@framework/util";
import { GetCostsSummaryForPeriodQuery } from "../claimDetails";
import { GetClaimOverrideRates } from "./getClaimOverrideRates";
import { AwardRateOverrideType } from "@framework/constants/awardRateOverride";

export class GetClaimsTotalCosts extends QueryBase<TotalCosts> {
  constructor(
    private readonly partnerId: string,
    private readonly projectId: string,
    private readonly periodId: number,
  ) {
    super();
  }

  protected async run(context: IContext): Promise<TotalCosts> {
    const partner = await context.repositories.partners.getById(this.partnerId);
    const project = await context.repositories.projects.getById(this.projectId);

    const profileOverridesQuery = new GetClaimOverrideRates(this.partnerId);
    const costSummaryQuery = new GetCostsSummaryForPeriodQuery(this.projectId, this.partnerId, this.periodId);

    const claimOverrides = await context.runQuery(profileOverridesQuery);
    const claimDetails = await context.runQuery(costSummaryQuery);

    return this.calculateTotalCostsToBePaid(claimDetails, claimOverrides, partner.awardRate, project.Acc_NonFEC__c);
  }

  private calculateTotalCostsToBePaid = (
    claimDetails: CostsSummaryForPeriodDto[],
    claimOverrides: ClaimOverrideRateDto,
    projectAwardRate = 0,
    isNonFec: boolean,
  ): TotalCosts => {
    const totalCostsClaimed: number = sumBy(claimDetails, claim => claim.costsClaimedThisPeriod);

    // Start off with a simple calculation
    let totalCostsPaid = this.calculateCostsClaimed(projectAwardRate, totalCostsClaimed);

    // If there are cost category overrides...
    if (claimOverrides.type !== AwardRateOverrideType.NONE) {
      // Perform cost category based calculations
      totalCostsPaid = this.calculateCostsClaimedWithCostCategoryOverrides(
        claimDetails,
        claimOverrides,
        projectAwardRate,
      );
    }

    return { totalCostsClaimed: roundCurrency(totalCostsClaimed), totalCostsPaid: roundCurrency(totalCostsPaid) };
  };

  private calculateCostsClaimedWithCostCategoryOverrides(
    claimDetails: CostsSummaryForPeriodDto[],
    claimOverrides: CostCategoryClaimOverrideRates | PeriodClaimOverrideRates,
    projectAwardRate = 0,
  ): number {
    let total = 0;

    for (const claimDetail of claimDetails) {
      let claimOverride: CostCategoryClaimOverrideRate | PeriodClaimOverrideRate | undefined;

      switch (claimOverrides.type) {
        case AwardRateOverrideType.BY_COST_CATEGORY:
          claimOverride = claimOverrides.overrides.find(x => x.costCategoryId === claimDetail.costCategoryId);
          break;
        case AwardRateOverrideType.BY_PERIOD:
          claimOverride = claimOverrides.overrides.find(x => x.period === this.periodId);
          break;
      }

      const awardRatePercentage = claimOverride?.amount ?? claimDetail.overrideAwardRate ?? projectAwardRate;
      total += this.calculateCostsClaimed(awardRatePercentage, claimDetail.costsClaimedThisPeriod);
    }

    return total;
  }

  private calculateCostsClaimed(awardRate: number, costsClaimed: number): number {
    const decimalAwardRate = awardRate / 100;
    return decimalAwardRate * costsClaimed;
  }
}
