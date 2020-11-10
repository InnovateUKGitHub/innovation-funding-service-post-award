import { QueryBase } from "@server/features/common";
import { GetCostCategoriesQuery } from "@server/features/claims";
import { Authorisation, CostsSummaryForPeriodDto, IContext, ProjectRole } from "@framework/types";

export class GetCostsSummaryForPeriodQuery extends QueryBase<CostsSummaryForPeriodDto[]> {
    constructor(
      private readonly projectId: string,
      private readonly partnerId: string,
      private readonly periodId: number
    ) {
      super();
    }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager)
    || auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    const partner = await context.repositories.partners.getById(this.partnerId);
    const allClaimDetails = await context.repositories.claimDetails.getAllByPartner(this.partnerId);
    const allForecastDetails = await context.repositories.profileDetails.getAllByPartner(this.partnerId);
    const totalForecastResults = await context.repositories.profileTotalCostCategory.getAllByPartnerId(this.partnerId);
    const costCategories = await context.runQuery(new GetCostCategoriesQuery()).then(x => x.filter(y => y.organisationType === partner.organisationType && y.competitionType === partner.competitionType));

    return costCategories.map(costCategory => {

      const forecastThisPeriod = allForecastDetails
        .filter(y => y.Acc_CostCategory__c === costCategory.id && y.Acc_ProjectPeriodNumber__c === this.periodId)
        .map(y => y.Acc_LatestForecastCost__c)[0] || 0;

      const offerTotal = totalForecastResults
        .filter(x => x.Acc_CostCategory__c === costCategory.id)
        .map(x => x.Acc_CostCategoryGOLCost__c)[0] || 0;

      const costsClaimedToDate = allClaimDetails
        .filter(y => y.Acc_CostCategory__c === costCategory.id && y.Acc_ProjectPeriodNumber__c < this.periodId)
        .reduce((t, c) => t + c.Acc_PeriodCostCategoryTotal__c, 0);

      const costsClaimedThisPeriod = allClaimDetails
        .filter(x => x.Acc_CostCategory__c === costCategory.id && x.Acc_ProjectPeriodNumber__c === this.periodId)
        .map(x => x.Acc_PeriodCostCategoryTotal__c)[0] || 0;

      const remainingOfferCosts = offerTotal - costsClaimedToDate - costsClaimedThisPeriod;

      return ({
        costCategoryId: costCategory.id,
        offerTotal,
        forecastThisPeriod,
        costsClaimedToDate,
        costsClaimedThisPeriod,
        remainingOfferCosts
      });
    });
  }
}
