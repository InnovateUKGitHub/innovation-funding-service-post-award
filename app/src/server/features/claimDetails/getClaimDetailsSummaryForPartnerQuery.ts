import { QueryBase } from "../common";
import { GetCostCategoriesQuery } from "../claims";
import { Authorisation, IContext, ProjectRole } from "../../../types";

export class GetClaimDetailsSummaryForPartnerQuery extends QueryBase<ClaimDetailsSummaryDto[]> {
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
    const claimDetailResults = await context.repositories.claimDetails.getAllByPartnerForPeriod(this.partnerId, this.periodId);
    const totalCostCategoryResults = await context.repositories.claimDetails.getAllByPartnerWithPeriodLt(this.partnerId, this.periodId);
    const totalForcastResults = await context.repositories.profileTotalCostCategory.getAllByPartnerId(this.partnerId);
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());

    return claimDetailResults.map(claimDetail => {
      const forecast = totalForcastResults
        .filter(y => y.Acc_CostCategory__c === claimDetail.Acc_CostCategory__c)
        .map(y => y.Acc_CostCategoryGOLCost__c)[0] || 0;

      const totalCostCategory = totalCostCategoryResults
        .filter(y => y.Acc_CostCategory__c === claimDetail.Acc_CostCategory__c)
        .map(y => y.Acc_PeriodCostCategoryTotal__c)
        .reduce((t, c) => t + c, 0);

      const offerCosts = forecast || 0;
      const costsClaimedThisPeriod = claimDetail.Acc_PeriodCostCategoryTotal__c || 0;
      const costsClaimedToDate = totalCostCategory;
      const remainingOfferCosts = offerCosts - totalCostCategory - costsClaimedThisPeriod;

      return ({
        costCategoryId: claimDetail.Acc_CostCategory__c,
        offerCosts,
        costsClaimedToDate,
        costsClaimedThisPeriod,
        remainingOfferCosts
      });
    }).sort((x, y) => costCategories.findIndex((costCat) => costCat.id === x.costCategoryId) - costCategories.findIndex((costCat) => costCat.id === y.costCategoryId));
  }
}
