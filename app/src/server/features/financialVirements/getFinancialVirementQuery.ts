import { AwardRateOverrideType } from "@framework/constants/awardRateOverride";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { CostCategoryFinancialVirement, PartnerFinancialVirement } from "@framework/entities";
import {
  Authorisation,
  ClaimOverrideRateDto,
  CostCategoryVirementDto,
  FinancialVirementDto,
  IContext,
  PartnerVirementsDto,
  ProjectRole,
} from "@framework/types";
import { roundCurrency, sumBy } from "@framework/util";
import { QueryBase } from "@server/features/common";
import { GetClaimOverrideRates } from "../claims/getClaimOverrideRates";
import { GetFilteredCostCategoriesQuery, GetUnfilteredCostCategoriesQuery } from "../claims/getCostCategoriesQuery";

export class GetFinancialVirementQuery extends QueryBase<FinancialVirementDto> {
  constructor(
    private readonly projectId: string,
    private readonly pcrItemId: string,
    private readonly partnerId?: string,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected async run(context: IContext): Promise<FinancialVirementDto> {
    const costCategories = await context.runQuery(
      this.partnerId ? new GetFilteredCostCategoriesQuery(this.partnerId) : new GetUnfilteredCostCategoriesQuery(),
    );

    const data = await context.repositories.financialVirements.getAllForPcr(this.pcrItemId);

    const partners = await Promise.all(data.map(x => this.mapPartner(context, x, costCategories)));

    const costsClaimedToDate = roundCurrency(sumBy(partners, v => v.costsClaimedToDate));
    const originalEligibleCosts = roundCurrency(sumBy(partners, v => v.originalEligibleCosts));
    const originalRemainingCosts = roundCurrency(sumBy(partners, v => v.originalRemainingCosts));
    const originalRemainingGrant = roundCurrency(sumBy(partners, v => v.originalRemainingGrant));
    const newEligibleCosts = roundCurrency(sumBy(partners, v => v.newEligibleCosts));
    const newRemainingCosts = roundCurrency(sumBy(partners, v => v.newRemainingCosts));
    const newRemainingGrant = roundCurrency(sumBy(partners, v => v.newRemainingGrant));

    const originalFundingLevel = roundCurrency(
      originalRemainingCosts ? (100 * originalRemainingGrant) / originalRemainingCosts : 0,
    );
    const newFundingLevel = roundCurrency(newRemainingCosts ? (100 * newRemainingGrant) / newRemainingCosts : 0);

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
      currentPartnerId: this.partnerId,
      partners,
    };
  }

  private async mapPartner(
    context: IContext,
    partner: PartnerFinancialVirement,
    costCategories: CostCategoryDto[],
  ): Promise<PartnerVirementsDto> {
    const { partnerId, originalFundingLevel, newFundingLevel } = partner;
    const overrides = await context.runQuery(new GetClaimOverrideRates(partnerId));

    const costCategoryVirements = partner.virements.map(x =>
      this.mapCostCategory(x, costCategories, overrides, partner),
    );

    const totalCostsClaimedToDate = roundCurrency(sumBy(costCategoryVirements, v => v.costsClaimedToDate));
    const totalOriginalEligibleCosts = roundCurrency(sumBy(costCategoryVirements, v => v.originalEligibleCosts));

    // Note: Defensive coding here - not clear if setting newRemainingGrant on create
    const roundedNewRemainingGrant = roundCurrency(sumBy(costCategoryVirements, v => v.newRemainingGrant));

    const originalRemainingGrant = roundCurrency(sumBy(costCategoryVirements, v => v.originalRemainingGrant));

    // Note: Defensive coding here - not clear if setting newEligibleCosts on create
    const roundedNewEligibleCosts = roundCurrency(sumBy(costCategoryVirements, v => v.newEligibleCosts));

    const originalRemainingCosts = roundCurrency(totalOriginalEligibleCosts - totalCostsClaimedToDate);
    const newRemainingCosts = roundCurrency(roundedNewEligibleCosts - totalCostsClaimedToDate);

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
    overrides: ClaimOverrideRateDto,
    partner: PartnerFinancialVirement,
  ): CostCategoryVirementDto {
    const costCategoryName = costCategories.filter(x => x.id === virement.costCategoryId).map(x => x.name)[0];

    let { originalFundingLevel, newFundingLevel } = partner;

    if (overrides.type === AwardRateOverrideType.BY_COST_CATEGORY) {
      const override = overrides.overrides.find(x => x.costCategoryId === virement.costCategoryId);

      if (override) {
        originalFundingLevel = override.amount;
        newFundingLevel = override.amount;
      }
    }

    const originalRemainingCosts = virement.originalEligibleCosts - virement.originalCostsClaimedToDate;
    const newRemainingCosts = virement.newEligibleCosts - virement.originalCostsClaimedToDate;
    const originalRemainingGrant = roundCurrency(originalRemainingCosts * (originalFundingLevel / 100));
    const newRemainingGrant = roundCurrency(newRemainingCosts * (newFundingLevel / 100));

    return {
      costCategoryName,
      originalRemainingCosts,
      newRemainingCosts,
      costCategoryId: virement.costCategoryId,
      costsClaimedToDate: virement.originalCostsClaimedToDate,
      originalEligibleCosts: virement.originalEligibleCosts,
      newEligibleCosts: virement.newEligibleCosts,
      originalRemainingGrant,
      newRemainingGrant,
    };
  }
}
