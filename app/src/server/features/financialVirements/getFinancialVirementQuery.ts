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
      originalEligibleCosts: this.sumTotalCost(v => v.originalEligibleCosts, data),
      originalCostsClaimed: this.sumTotalCost(v => v.originalCostsClaimedToDate, data),
      originalCostsNotYetClaimed: this.sumTotalCost(v => v.originalEligibleCosts - v.originalCostsClaimedToDate, data),
      originalRemaining: 0,
      newEligibleCosts: this.sumTotalCost(v => v.newEligibleCosts, data),
      newCostsNotYetClaimed: this.sumTotalCost(v => v.newEligibleCosts - v.originalCostsClaimedToDate, data),
      newRemaining: 0,
      partners: data
        .map(partner => ({
          partnerId: partner.partnerId,
          originalEligibleCosts: this.sumPartnerCost(v => v.originalEligibleCosts, partner),
          originalCostsClaimed: this.sumPartnerCost(v => v.originalCostsClaimedToDate, partner),
          originalCostsNotYetClaimed: this.sumPartnerCost(v => v.originalEligibleCosts - v.originalCostsClaimedToDate, partner),
          originalRemaining: 0,
          newEligibleCosts: this.sumPartnerCost(v => v.newEligibleCosts, partner),
          newCostsNotYetClaimed: this.sumPartnerCost(v => v.newEligibleCosts - v.originalCostsClaimedToDate, partner),
          newRemaining: 0,
          virements: partner.virements.map(virement => ({
            costCategoryId: virement.costCategoryId,
            costCategoryName: costCategories.filter(x => x.id === virement.costCategoryId).map(x => x.name)[0],
            originalEligibleCosts: virement.originalEligibleCosts,
            originalCostsClaimed: virement.originalCostsClaimedToDate,
            originalCostsNotYetClaimed: virement.originalEligibleCosts - virement.originalCostsClaimedToDate,
            originalRemaining: 0,
            newEligibleCosts: virement.newEligibleCosts,
            newCostsNotYetClaimed: virement.originalEligibleCosts - virement.newEligibleCosts,
            newRemaining: 0,
          }))
        })),
    };
  }
}
