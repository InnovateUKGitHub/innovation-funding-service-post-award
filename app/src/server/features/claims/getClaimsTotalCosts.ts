import { QueryBase } from "@server/features/common";
import { CostsSummaryForPeriodDto, IContext, TotalCosts } from "@framework/types";
import { roundCurrency, sumBy } from "@framework/util";
import { GetCostsSummaryForPeriodQuery } from "../claimDetails";

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

    const costSummaryQuery = new GetCostsSummaryForPeriodQuery(this.projectId, this.partnerId, this.periodId);
    const claimDetails = await context.runQuery(costSummaryQuery);

    return this.calculateTotalCostsToBePaid(claimDetails, partner.awardRate, project.Acc_NonFEC__c);
  }

  private calculateTotalCostsToBePaid = (
    claimDetails: CostsSummaryForPeriodDto[],
    projectAwardRate = 0,
    isNonFec: boolean,
  ): TotalCosts => {
    const totalCostsClaimed: number = sumBy(claimDetails, claim => claim.costsClaimedThisPeriod);

    const totalCostsPaid = isNonFec
      ? this.calculateCostsClaimedByIndividualClaim(claimDetails, projectAwardRate)
      : (totalCostsClaimed * projectAwardRate) / 100;

    return { totalCostsClaimed: roundCurrency(totalCostsClaimed), totalCostsPaid: roundCurrency(totalCostsPaid) };
  };

  private calculateCostsClaimedByIndividualClaim(
    claimDetails: CostsSummaryForPeriodDto[],
    projectAwardRate: number,
  ): number {
    return claimDetails.reduce((total, claim) => {
      const awardRate = claim.overrideAwardRate ?? projectAwardRate;
      const divisibleAwardRate = awardRate / 100;
      const claimTotal = claim.costsClaimedThisPeriod * divisibleAwardRate;

      return total + claimTotal;
    }, 0);
  }
}
