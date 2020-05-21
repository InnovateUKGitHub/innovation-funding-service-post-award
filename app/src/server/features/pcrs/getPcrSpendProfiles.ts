import { QueryBase } from "@server/features/common";
import { IContext, PCRSpendProfileCapitalUsageType } from "@framework/types";
import { CostCategoryType, PcrSpendProfileEntity } from "@framework/entities";
import { GetCostCategoriesQuery } from "@server/features/claims";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import {
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PcrSpendProfileDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileUnknownCostDto,
} from "@framework/dtos/pcrSpendProfileDto";

export class GetPcrSpendProfilesQuery extends QueryBase<PcrSpendProfileDto> {
  constructor(private readonly pcrItemId: string) {
    super();
  }

  protected async Run(context: IContext): Promise<PcrSpendProfileDto> {
    const spendProfiles = await context.repositories.pcrSpendProfile.getAllForPcr(this.pcrItemId);
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    return {
      pcrItemId: this.pcrItemId,
      costs: costCategories
        // For each cost category filter and map costs
        .map(x => this.mapCosts(x, spendProfiles.filter(s => s.costCategoryId === x.id)))
        // Flatten array
        .reduce((acc, x) => acc.concat(x), [])
    };
  }

  private mapCosts(costCategory: CostCategoryDto, spendProfiles: PcrSpendProfileEntity[]): PCRSpendProfileCostDto[] {
    switch (costCategory.type) {
      case CostCategoryType.Labour: return this.mapLabourCosts(spendProfiles, costCategory.type);
      case CostCategoryType.Materials: return this.mapMaterialsCosts(spendProfiles, costCategory.type);
      case CostCategoryType.Subcontracting: return this.mapSubcontractingCosts(spendProfiles, costCategory.type);
      case CostCategoryType.Capital_Usage: return this.mapCapitalUsageCosts(spendProfiles, costCategory.type);
      default: return this.mapUnknownCosts(spendProfiles, CostCategoryType.Unknown);
    }
  }

  private mapBaseCostFields(spendProfile: PcrSpendProfileEntity) {
    return {
      id: spendProfile.id,
      costCategoryId: spendProfile.costCategoryId,
      value: !!spendProfile.value || spendProfile.value === 0 ? spendProfile.value : null,
      description: spendProfile.description || null,
    };
  }

  private mapUnknownCosts(spendProfiles: PcrSpendProfileEntity[], costCategory: CostCategoryType.Unknown): PCRSpendProfileUnknownCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
    }));
  }

  private mapLabourCosts(spendProfiles: PcrSpendProfileEntity[], costCategory: CostCategoryType.Labour): PCRSpendProfileLabourCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      grossCostOfRole: !!x.grossCostOfRole || x.grossCostOfRole === 0 ? x.grossCostOfRole : null,
      daysSpentOnProject: !!x.daysSpentOnProject || x.daysSpentOnProject === 0 ? x.daysSpentOnProject : null,
      ratePerDay: !!x.ratePerDay || x.ratePerDay === 0 ? x.ratePerDay : null,
    }));
  }

  private mapSubcontractingCosts(spendProfiles: PcrSpendProfileEntity[], costCategory: CostCategoryType.Subcontracting): PCRSpendProfileSubcontractingCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      subcontractorCountry: x.subcontractorCountry || null,
      subcontractorRoleAndDescription: x.subcontractorRoleAndDescription || null,
    }));
  }

  private mapMaterialsCosts(spendProfiles: PcrSpendProfileEntity[], costCategory: CostCategoryType.Materials): PCRSpendProfileMaterialsCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      costPerItem: !!x.costPerItem || x.costPerItem === 0 ? x.costPerItem : null,
      quantity: !!x.quantity || x.quantity === 0 ? x.quantity : null,
    }));
  }

  private mapCapitalUsageCosts(spendProfiles: PcrSpendProfileEntity[], costCategory: CostCategoryType.Capital_Usage): PCRSpendProfileCapitalUsageCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      type: x.type || PCRSpendProfileCapitalUsageType.Unknown,
      depreciationPeriod: !!x.depreciationPeriod || x.depreciationPeriod === 0 ? x.depreciationPeriod : null,
      netPresentValue: !!x.netPresentValue || x.netPresentValue === 0 ? x.netPresentValue : null,
      residualValue: !!x.residualValue || x.residualValue === 0 ? x.residualValue : null,
      utilisation: !!x.utilisation || x.utilisation === 0 ? x.utilisation : null
    }));
  }
}
