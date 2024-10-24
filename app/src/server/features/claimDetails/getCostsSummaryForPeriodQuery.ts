import { ProjectRolePermissionBits } from "@framework/constants/project";
import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { GetFilteredCostCategoriesQuery } from "../claims/getCostCategoriesQuery";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";

export class GetCostsSummaryForPeriodQuery extends AuthorisedAsyncQueryBase<CostsSummaryForPeriodDto[]> {
  public readonly runnableName: string = "GetCostsSummaryForPeriodQuery";
  constructor(
    private readonly projectId: ProjectId,
    private readonly partnerId: PartnerId,
    private readonly periodId: number,
  ) {
    super();
  }

  async accessControl(auth: Authorisation) {
    return (
      auth
        .forProject(this.projectId)
        .hasAnyRoles(ProjectRolePermissionBits.MonitoringOfficer, ProjectRolePermissionBits.ProjectManager) ||
      auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRolePermissionBits.FinancialContact)
    );
  }

  protected async run(context: IContext) {
    const partner = await context.repositories.partners.getById(this.partnerId);
    const allClaimDetails = await context.repositories.claimDetails.getAllByPartner(this.partnerId);
    const allForecastDetails = await context.repositories.profileDetails.getAllByPartner(this.partnerId);
    const totalForecastResults = await context.repositories.profileTotalCostCategory.getAllByPartnerId(this.partnerId);
    const costCategories = await context.runQuery(new GetFilteredCostCategoriesQuery(partner.id));

    return costCategories.map(costCategory => {
      const forecastThisPeriod =
        allForecastDetails
          .filter(y => y.Acc_CostCategory__c === costCategory.id && y.Acc_ProjectPeriodNumber__c === this.periodId)
          .map(y => y.Acc_LatestForecastCost__c)[0] || 0;

      const offerTotal =
        totalForecastResults
          .filter(x => x.Acc_CostCategory__c === costCategory.id)
          .map(x => x.Acc_CostCategoryGOLCost__c)[0] || 0;

      const costsClaimedToDate = allClaimDetails
        .filter(y => y.Acc_CostCategory__c === costCategory.id && y.Acc_ProjectPeriodNumber__c < this.periodId)
        .reduce((t, c) => t + c.Acc_PeriodCostCategoryTotal__c, 0);

      const costsClaimedThisPeriod =
        allClaimDetails
          .filter(x => x.Acc_CostCategory__c === costCategory.id && x.Acc_ProjectPeriodNumber__c === this.periodId)
          .map(x => x.Acc_PeriodCostCategoryTotal__c)[0] || 0;

      const remainingOfferCosts = offerTotal - costsClaimedToDate - costsClaimedThisPeriod;

      return {
        costCategoryId: costCategory.id,
        offerTotal,
        forecastThisPeriod,
        costsClaimedToDate,
        costsClaimedThisPeriod,
        remainingOfferCosts,
        overrideAwardRate: costCategory.overrideAwardRate,
      };
    });
  }
}
