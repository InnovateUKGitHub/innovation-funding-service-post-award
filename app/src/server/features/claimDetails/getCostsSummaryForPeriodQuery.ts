import { QueryBase } from "@server/features/common";
import { GetCostCategoriesQuery } from "@server/features/claims";
import { Authorisation, IContext, ProjectRole } from "@framework/types";

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
    const claimDetailResults = await context.repositories.claimDetails.getAllByPartnerForPeriod(this.partnerId, this.periodId);
    const totalCostCategoryResults = await context.repositories.claimDetails.getAllByPartnerWithPeriodLt(this.partnerId, this.periodId);
    const totalForcastResults = await context.repositories.profileTotalCostCategory.getAllByPartnerId(this.partnerId);
    const costCategories = await context.runQuery(new GetCostCategoriesQuery()).then(x => x.filter(y => y.organisationType === partner.Acc_OrganisationType__c && y.competitionType === partner.Acc_ProjectId__r.Acc_CompetitionType__c));

    return costCategories.map(costCategory => {

      const forecast = totalForcastResults
        .filter(y => y.Acc_CostCategory__c === costCategory.id)
        .map(y => y.Acc_CostCategoryGOLCost__c)[0] || 0;

      const totalCostCategory = totalCostCategoryResults
        .filter(y => y.Acc_CostCategory__c === costCategory.id)
        .map(y => y.Acc_PeriodCostCategoryTotal__c)
        .reduce((t, c) => t + c, 0);

      const claimDetail = claimDetailResults.find(x => x.Acc_CostCategory__c === costCategory.id);

      const offerCosts = forecast || 0;
      const costsClaimedThisPeriod = claimDetail && claimDetail.Acc_PeriodCostCategoryTotal__c || 0;
      const costsClaimedToDate = totalCostCategory;
      const remainingOfferCosts = offerCosts - totalCostCategory - costsClaimedThisPeriod;

      return ({
        costCategoryId: costCategory.id,
        offerCosts,
        costsClaimedToDate,
        costsClaimedThisPeriod,
        remainingOfferCosts
      });
    });
  }
}
