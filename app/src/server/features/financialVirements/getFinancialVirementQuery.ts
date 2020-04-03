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

  private sum<T>(items: T[], value: (item: T) => number) {
    return items.reduce((total, item) => total + value(item), 0);
  }

  protected async Run(context: IContext): Promise<FinancialVirementDto> {

    const costCategories = await context.runQuery(new GetCostCategoriesQuery());

    const data = await context.repositories.financialVirements.getAllForPcr(this.pcrItemId);

    const partners = data.map(x => this.mapPartner(x, costCategories));

    const costsClaimedToDate = this.sum(partners, v => v.costsClaimedToDate);
    const originalEligibleCosts = this.sum(partners, v => v.originalEligibleCosts);
    const originalRemainingCosts = this.sum(partners, v => v.originalRemainingCosts);
    const originalRemainingGrant = this.sum(partners, v => v.originalRemainingGrant);
    const newEligibleCosts = this.sum(partners, v => v.newEligibleCosts);
    const newRemainingCosts = this.sum(partners, v => v.newRemainingCosts);
    const newRemainingGrant = this.sum(partners, v => v.newRemainingGrant);

    const originalFundingLevel = originalRemainingCosts ? 100 * originalRemainingGrant / originalRemainingCosts : 0;
    const newFundingLevel = newRemainingCosts ? 100 * newRemainingGrant / newRemainingCosts : 0;

    return {
      pcrItemId: this.pcrItemId,
      costsClaimedToDate,
      originalEligibleCosts,
      originalRemainingCosts,
      originalRemainingGrant,
      originalFundingLevel,
      newEligibleCosts,
      newRemainingCosts,
      newRemainingGrant,
      newFundingLevel,
      partners,
    };
  }

  private mapPartner(partner: PartnerFinancialVirement, costCategories: CostCategoryDto[]): PartnerVirementsDto {
    const originalFundingPercentage = partner.originalFundingLevel / 100;
    const newFundingPercentage = partner.newFundingLevel / 100;

    const virements = partner.virements.map(x => this.mapCostCategory(x, costCategories));

    const costsClaimedToDate = this.sum(virements, v => v.costsClaimedToDate);

    const originalEligibleCosts = this.sum(virements, v => v.originalEligibleCosts);
    const originalRemainingCosts = originalEligibleCosts - costsClaimedToDate;

    const newEligibleCosts = this.sum(virements, v => v.newEligibleCosts);
    const newRemainingCosts = newEligibleCosts - costsClaimedToDate;

    const originalRemainingGrant = originalRemainingCosts * originalFundingPercentage;
    const newRemainingGrant = newRemainingCosts * newFundingPercentage;

    return {
      partnerId: partner.partnerId,
      costsClaimedToDate: this.sum(virements, v => v.costsClaimedToDate),
      originalEligibleCosts,
      originalRemainingCosts,
      originalFundingLevel: partner.originalFundingLevel,
      newEligibleCosts,
      newRemainingCosts,
      newFundingLevel: partner.newFundingLevel,
      originalRemainingGrant,
      newRemainingGrant,
      virements,
    };
  }

  private mapCostCategory(virement: CostCategoryFinancialVirement, costCategories: CostCategoryDto[]): CostCategoryVirementDto {
    return {
      costCategoryId: virement.costCategoryId,
      costCategoryName: costCategories.filter(x => x.id === virement.costCategoryId).map(x => x.name)[0],
      costsClaimedToDate: virement.originalCostsClaimedToDate,
      originalEligibleCosts: virement.originalEligibleCosts,
      originalRemainingCosts: virement.originalEligibleCosts - virement.originalCostsClaimedToDate,
      newEligibleCosts: virement.newEligibleCosts,
      newRemainingCosts: virement.newEligibleCosts - virement.originalCostsClaimedToDate,
    };
  }

}
