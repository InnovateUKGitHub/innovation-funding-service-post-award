import { QueryBase } from "@server/features/common";
import {
  Authorisation,
  CostCategoryVirementDto,
  FinancialVirementDto,
  IContext,
  PartnerVirementsDto,
  ProjectRole,
} from "@framework/types";
import { CostCategoryFinancialVirement, PartnerFinancialVirement } from "@framework/entities";
import { GetCostCategoriesQuery } from "../claims/getCostCategoriesQuery";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import {
  calculateNewEligibleCosts,
  calculateNewRemainingGrant,
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

    const originalFundingLevel = originalRemainingCosts ? (100 * originalRemainingGrant) / originalRemainingCosts : 0;
    const newFundingLevel = newRemainingCosts ? (100 * newRemainingGrant) / newRemainingCosts : 0;

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
    const { partnerId, newFundingLevel, newRemainingGrant, newEligibleCosts, originalFundingLevel } = partner;

    const costCategoryVirements = partner.virements.map(x => this.mapCostCategory(x, costCategories));

    const totalCostsClaimedToDate = sum(costCategoryVirements, v => v.costsClaimedToDate);
    const totalOriginalEligibleCosts = sum(costCategoryVirements, v => v.originalEligibleCosts);

    // Note: Defensive coding here - not clear if setting newRemainingGrant on create
    const roundedNewRemainingGrant = newRemainingGrant
      ? roundCurrency(newRemainingGrant)
      : calculateNewRemainingGrant(costCategoryVirements, newFundingLevel);

    // Note: Defensive coding here - not clear if setting newEligibleCosts on create
    const roundedNewEligibleCosts = newEligibleCosts
      ? roundCurrency(newEligibleCosts)
      : calculateNewEligibleCosts(costCategoryVirements);

    const originalRemainingCosts = totalOriginalEligibleCosts - totalCostsClaimedToDate;
    const originalFundingPercentage = originalFundingLevel / 100;
    const originalRemainingGrant = roundCurrency(originalRemainingCosts * originalFundingPercentage);
    const newRemainingCosts = roundedNewEligibleCosts - totalCostsClaimedToDate;

    return {
      partnerId,
      costsClaimedToDate: totalCostsClaimedToDate,
      originalEligibleCosts: totalOriginalEligibleCosts,
      originalRemainingCosts,
      originalFundingLevel,
      newEligibleCosts: roundedNewEligibleCosts,
      newRemainingCosts,
      newFundingLevel,
      originalRemainingGrant,
      newRemainingGrant: roundedNewRemainingGrant,
      virements: costCategoryVirements,
    };
  }

  private mapCostCategory(
    virement: CostCategoryFinancialVirement,
    costCategories: CostCategoryDto[],
  ): CostCategoryVirementDto {
    const costCategoryName = costCategories.filter(x => x.id === virement.costCategoryId).map(x => x.name)[0];
    const originalRemainingCosts = virement.originalEligibleCosts - virement.originalCostsClaimedToDate;
    const newRemainingCosts = virement.newEligibleCosts - virement.originalCostsClaimedToDate;

    return {
      costCategoryName,
      originalRemainingCosts,
      newRemainingCosts,
      costCategoryId: virement.costCategoryId,
      costsClaimedToDate: virement.originalCostsClaimedToDate,
      originalEligibleCosts: virement.originalEligibleCosts,
      newEligibleCosts: virement.newEligibleCosts,
    };
  }
}
