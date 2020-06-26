import { QueryBase } from "@server/features/common";
import { IContext, PCRSpendProfileCapitalUsageType, PCRSpendProfileOverheadRate } from "@framework/types";
import { CostCategoryType, PcrSpendProfileEntity } from "@framework/entities";
import { GetCostCategoriesQuery } from "@server/features/claims";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import {
  PCRSpendProfileAcademicCostDto,
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PcrSpendProfileDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileOverheadsCostDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { isNumber } from "@framework/util";

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
      case CostCategoryType.Academic: return this.mapAcademicCosts(spendProfiles, costCategory.type);
      case CostCategoryType.Labour: return this.mapLabourCosts(spendProfiles, costCategory.type);
      case CostCategoryType.Overheads: return this.mapOverheadsCosts(spendProfiles, costCategory.type);
      case CostCategoryType.Materials: return this.mapMaterialsCosts(spendProfiles, costCategory.type);
      case CostCategoryType.Subcontracting: return this.mapSubcontractingCosts(spendProfiles, costCategory.type);
      case CostCategoryType.Capital_Usage: return this.mapCapitalUsageCosts(spendProfiles, costCategory.type);
      case CostCategoryType.Travel_And_Subsistence: return this.mapTravelAndSubsCosts(spendProfiles, costCategory.type);
      default: return this.mapOtherCosts(spendProfiles, CostCategoryType.Other_Costs);
    }
  }

  private mapBaseCostFields(spendProfile: PcrSpendProfileEntity) {
    return {
      id: spendProfile.id,
      costCategoryId: spendProfile.costCategoryId,
      value: isNumber(spendProfile.value) ? spendProfile.value : null,
      description: spendProfile.description || null,
    };
  }

  private mapAcademicCosts(spendProfiles: PcrSpendProfileEntity[], costCategory: CostCategoryType.Academic): PCRSpendProfileAcademicCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
    }));
  }

  private mapLabourCosts(spendProfiles: PcrSpendProfileEntity[], costCategory: CostCategoryType.Labour): PCRSpendProfileLabourCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      grossCostOfRole: isNumber(x.grossCostOfRole) ? x.grossCostOfRole : null,
      daysSpentOnProject: isNumber(x.daysSpentOnProject) ? x.daysSpentOnProject : null,
      ratePerDay: isNumber(x.ratePerDay) ? x.ratePerDay : null,
    }));
  }

  private mapOverheadsCosts(spendProfiles: PcrSpendProfileEntity[], costCategory: CostCategoryType.Overheads): PCRSpendProfileOverheadsCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      overheadRate: x.overheadRate || PCRSpendProfileOverheadRate.Unknown
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
      costPerItem: isNumber(x.costPerItem) ? x.costPerItem : null,
      quantity: isNumber(x.quantity) ? x.quantity : null,
    }));
  }

  private mapCapitalUsageCosts(spendProfiles: PcrSpendProfileEntity[], costCategory: CostCategoryType.Capital_Usage): PCRSpendProfileCapitalUsageCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      type: x.capitalUsageType || PCRSpendProfileCapitalUsageType.Unknown,
      typeLabel: x.typeLabel || null,
      depreciationPeriod: isNumber(x.depreciationPeriod) ? x.depreciationPeriod : null,
      netPresentValue: isNumber(x.netPresentValue) ? x.netPresentValue : null,
      residualValue: isNumber(x.residualValue) ? x.residualValue : null,
      utilisation: isNumber(x.utilisation) ? x.utilisation : null
    }));
  }

  private mapTravelAndSubsCosts(spendProfiles: PcrSpendProfileEntity[], costCategory: CostCategoryType.Travel_And_Subsistence): PCRSpendProfileTravelAndSubsCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      numberOfTimes: isNumber(x.numberOfTimes) ? x.numberOfTimes : null,
      costOfEach: isNumber(x.costOfEach) ? x.costOfEach : null,
    }));
  }

  /* tslint:disable-next-line:no-identical-functions */
  private mapOtherCosts(spendProfiles: PcrSpendProfileEntity[], costCategory: CostCategoryType.Other_Costs): PCRSpendProfileOtherCostsDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
    }));
  }
}
