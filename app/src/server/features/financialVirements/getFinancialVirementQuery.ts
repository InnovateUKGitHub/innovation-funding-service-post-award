import { QueryBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { CostCategoryFinancialVirement, PartnerFinancialVirement } from "@framework/entities";
import { GetCostCategoriesQuery } from "../claims/getCostCategoriesQuery";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import {
  calculateNewEligibleCosts,
  calculateNewRemainingGrant
} from "@server/features/financialVirements/financialVirementsCalculations";
import { roundCurrency, sum } from "@framework/util";

export class GetFinancialVirementQuery extends QueryBase<FinancialVirementDto> {
  constructor(private readonly projectId: string, private readonly pcrId: string, private readonly pcrItemId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext): Promise<FinancialVirementDto> {

    const costCategories = await context.runQuery(new GetCostCategoriesQuery());

    const data = await context.repositories.financialVirements.getAllForPcr(this.pcrItemId);

    const partners = data.map(x => this.mapPartner(x, costCategories));

    const costsClaimedToDate = sum(partners, v => v.costsClaimedToDate);
    const originalEligibleCosts = sum(partners, v => v.originalEligibleCosts);
    const originalRemainingCosts = sum(partners, v => v.originalRemainingCosts);
    const originalRemainingGrant = sum(partners, v => v.originalRemainingGrant);
    const newEligibleCosts = sum(partners, v => v.newEligibleCosts);
    const newRemainingCosts = sum(partners, v => v.newRemainingCosts);
    const newRemainingGrant = sum(partners, v => v.newRemainingGrant);

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

    const virements = partner.virements.map(x => this.mapCostCategory(x, costCategories));

    const costsClaimedToDate = sum(virements, v => v.costsClaimedToDate);

    const originalEligibleCosts = sum(virements, v => v.originalEligibleCosts);
    const originalRemainingCosts = originalEligibleCosts - costsClaimedToDate;

    // Not clear if SF is setting newEligibleCosts on create so defensive coding here
    const newEligibleCosts = partner.newEligibleCosts !== undefined ? roundCurrency(partner.newEligibleCosts) : calculateNewEligibleCosts(virements);
    const newRemainingCosts = newEligibleCosts - costsClaimedToDate;
    const originalRemainingGrant = originalRemainingCosts * originalFundingPercentage;

    // Not clear if SF is setting newRemainingGrant on create so defensive coding here
    const newRemainingGrant = partner.newRemainingGrant !== undefined ? roundCurrency(partner.newRemainingGrant) : calculateNewRemainingGrant(virements, partner.newFundingLevel);

    return {
      partnerId: partner.partnerId,
      costsClaimedToDate: sum(virements, v => v.costsClaimedToDate),
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
