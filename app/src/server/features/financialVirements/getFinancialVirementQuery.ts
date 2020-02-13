import { QueryBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { CostCategoryFinancialVirement, PartnerFinancialVirement } from "@framework/entities";
import { GetCostCategoriesQuery } from "../claims/getCostCategoriesQuery";

export class GetFinancialVirementQuery extends QueryBase<FinancialVirementDto> {
  constructor(private projectId: string, private pcrId: string, private pcrItemId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  private sumPartnerCost(value: (item: CostCategoryFinancialVirement) => number, partner: PartnerFinancialVirement) {
    return partner.virements.reduce((total, item) => total + value(item), 0);
  }

  private sumTotalCost(value: (item: CostCategoryFinancialVirement) => number, partners: PartnerFinancialVirement[]) {
    return partners.reduce((total, item) => total + this.sumPartnerCost(value, item), 0);
  }

  protected async Run(context: IContext): Promise<FinancialVirementDto> {

    const costCategories = await context.runQuery(new GetCostCategoriesQuery());

    const data = await context.repositories.financialVirements.getAllForPcr(this.pcrItemId);
    return {
      pcrItemId: this.pcrItemId,
      totalEligibleCosts: this.sumTotalCost(v => v.originalEligibleCosts, data),
      totalCostsClaimed: this.sumTotalCost(v => v.originalCostsClaimedToDate, data),
      totalCostsNotYetClaimed: this.sumTotalCost(v => v.originalEligibleCosts - v.originalCostsClaimedToDate, data),
      totalRemaining: 0,
      newEligibleCosts: this.sumTotalCost(v => v.newCosts, data),
      newCostsNotYetClaimed: this.sumTotalCost(v => v.newCosts - v.originalCostsClaimedToDate, data),
      newRemaining: 0,
      partners: data
        .map(partner => ({
          partnerId: partner.partnerId,
          totalEligibleCosts: this.sumPartnerCost(v => v.originalEligibleCosts, partner),
          totalCostsClaimed: this.sumPartnerCost(v => v.originalCostsClaimedToDate, partner),
          totalCostsNotYetClaimed: this.sumPartnerCost(v => v.originalEligibleCosts - v.originalCostsClaimedToDate, partner),
          totalRemaining: 0,
          newEligibleCosts: this.sumPartnerCost(v => v.newCosts, partner),
          newCostsNotYetClaimed: this.sumPartnerCost(v => v.newCosts - v.originalCostsClaimedToDate, partner),
          newRemaining: 0,
          virements: partner.virements.map(virement => ({
            costCategoryId: virement.costCategoryId,
            costCategoryName: costCategories.filter(x => x.id === virement.costCategoryId).map(x => x.name)[0],
            totalEligibleCosts: virement.originalEligibleCosts,
            totalCostsClaimed: virement.originalCostsClaimedToDate,
            totalCostsNotYetClaimed: virement.originalEligibleCosts - virement.originalCostsClaimedToDate,
            totalRemaining: 0,
            newEligibleCosts: virement.newCosts,
            newCostsNotYetClaimed: virement.originalEligibleCosts - virement.newCosts,
            newRemaining: 0,
          }))
        })),
    };
  }
}
