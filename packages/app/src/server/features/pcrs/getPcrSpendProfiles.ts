import { CostCategoryGroupType, CostCategoryType } from "@framework/constants/enums";
import { PCRSpendProfileOverheadRate, PCRSpendProfileCapitalUsageType } from "@framework/constants/pcrConstants";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import {
  PCRSpendProfileAcademicCostDto,
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PcrSpendProfileDto,
  PCRSpendProfileFundingDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileOtherFundingDto,
  PCRSpendProfileOverheadsCostDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { PcrSpendProfileEntity } from "@framework/entities/pcrSpendProfile";
import { CostCategoryList } from "@framework/types/CostCategory";
import { IContext } from "@framework/types/IContext";
import { isNumber } from "@framework/util/numberHelper";
import { GetUnfilteredCostCategoriesQuery } from "../claims/getCostCategoriesQuery";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";

export class GetPcrSpendProfilesQuery extends AuthorisedAsyncQueryBase<PcrSpendProfileDto> {
  public readonly runnableName: string = "GetPcrSpendProfilesQuery";
  constructor(
    private readonly projectId: ProjectId,
    private readonly pcrItemId: PcrItemId,
  ) {
    super();
  }

  protected async run(context: IContext): Promise<PcrSpendProfileDto> {
    const spendProfiles = await context.repositories.pcrSpendProfile.getAllForPcr(this.projectId, this.pcrItemId);
    const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());
    return {
      pcrItemId: this.pcrItemId,
      costs: costCategories
        // For each cost category filter and map costs
        .map(x =>
          this.mapCosts(
            x,
            spendProfiles.filter(s => s.costCategoryId === x.id),
          ),
        )
        // Flatten array
        .reduce((acc, x) => acc.concat(x), []),
      funds: costCategories
        // For each cost category filter and map funds
        .map(x =>
          this.mapFunds(
            context,
            x,
            spendProfiles.filter(s => s.costCategoryId === x.id),
          ),
        )
        // Flatten array
        .reduce((acc, x) => acc.concat(x), []),
    };
  }

  private mapCosts(costCategory: CostCategoryDto, spendProfiles: PcrSpendProfileEntity[]): PCRSpendProfileCostDto[] {
    const costCategoryType = new CostCategoryList().fromId(costCategory.type);
    switch (costCategoryType.group) {
      case CostCategoryGroupType.Academic:
        return this.mapAcademicCosts(spendProfiles, costCategoryType.id);
      case CostCategoryGroupType.Labour:
        return this.mapLabourCosts(spendProfiles, costCategoryType.id);
      case CostCategoryGroupType.Overheads:
        return this.mapOverheadsCosts(spendProfiles, costCategoryType.id);
      case CostCategoryGroupType.Materials:
        return this.mapMaterialsCosts(spendProfiles, costCategoryType.id);
      case CostCategoryGroupType.Subcontracting:
        return this.mapSubcontractingCosts(spendProfiles, costCategoryType.id);
      case CostCategoryGroupType.Capital_Usage:
        return this.mapCapitalUsageCosts(spendProfiles, costCategoryType.id);
      case CostCategoryGroupType.Travel_And_Subsistence:
        return this.mapTravelAndSubsCosts(spendProfiles, costCategoryType.id);
      case CostCategoryGroupType.Other_Funding:
        return [];
      case CostCategoryGroupType.Other_Costs:
      default:
        return this.mapOtherCosts(spendProfiles, costCategoryType.id);
    }
  }

  private mapFunds(
    context: IContext,
    costCategory: CostCategoryDto,
    spendProfiles: PcrSpendProfileEntity[],
  ): PCRSpendProfileFundingDto[] {
    const costCategoryType = new CostCategoryList().fromId(costCategory.type);
    if (costCategoryType.group === CostCategoryGroupType.Other_Funding) {
      return this.mapOtherFunding(context, spendProfiles, costCategory.type);
    }
    return [];
  }

  private mapBaseCostFields(spendProfile: PcrSpendProfileEntity) {
    return {
      id: spendProfile.id,
      costCategoryId: spendProfile.costCategoryId,
      value: isNumber(spendProfile.value) ? spendProfile.value : null,
      description: spendProfile.description || null,
    };
  }

  private mapOtherFunding(
    context: IContext,
    spendProfiles: PcrSpendProfileEntity[],
    costCategory: CostCategoryType,
  ): PCRSpendProfileOtherFundingDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      dateSecured: context.clock.parseOptionalSalesforceDate(x.dateOtherFundingSecured || null),
    }));
  }

  private mapAcademicCosts(
    spendProfiles: PcrSpendProfileEntity[],
    costCategory: CostCategoryType,
  ): PCRSpendProfileAcademicCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
    }));
  }

  private mapLabourCosts(
    spendProfiles: PcrSpendProfileEntity[],
    costCategory: CostCategoryType,
  ): PCRSpendProfileLabourCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      grossCostOfRole: isNumber(x.grossCostOfRole) ? x.grossCostOfRole : null,
      daysSpentOnProject: isNumber(x.daysSpentOnProject) ? x.daysSpentOnProject : null,
      ratePerDay: isNumber(x.ratePerDay) ? x.ratePerDay : null,
    }));
  }

  private mapOverheadsCosts(
    spendProfiles: PcrSpendProfileEntity[],
    costCategory: CostCategoryType,
  ): PCRSpendProfileOverheadsCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      overheadRate: x.overheadRate || PCRSpendProfileOverheadRate.Unknown,
    }));
  }

  private mapSubcontractingCosts(
    spendProfiles: PcrSpendProfileEntity[],
    costCategory: CostCategoryType,
  ): PCRSpendProfileSubcontractingCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      subcontractorCountry: x.subcontractorCountry || null,
      subcontractorRoleAndDescription: x.subcontractorRoleAndDescription || null,
    }));
  }

  private mapMaterialsCosts(
    spendProfiles: PcrSpendProfileEntity[],
    costCategory: CostCategoryType,
  ): PCRSpendProfileMaterialsCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      costPerItem: isNumber(x.costPerItem) ? x.costPerItem : null,
      quantity: isNumber(x.quantity) ? x.quantity : null,
    }));
  }

  private mapCapitalUsageCosts(
    spendProfiles: PcrSpendProfileEntity[],
    costCategory: CostCategoryType,
  ): PCRSpendProfileCapitalUsageCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      type: x.capitalUsageType || PCRSpendProfileCapitalUsageType.Unknown,
      typeLabel: x.typeLabel || null,
      depreciationPeriod: isNumber(x.depreciationPeriod) ? x.depreciationPeriod : null,
      netPresentValue: isNumber(x.netPresentValue) ? x.netPresentValue : null,
      residualValue: isNumber(x.residualValue) ? x.residualValue : null,
      utilisation: isNumber(x.utilisation) ? x.utilisation : null,
    }));
  }

  private mapTravelAndSubsCosts(
    spendProfiles: PcrSpendProfileEntity[],
    costCategory: CostCategoryType,
  ): PCRSpendProfileTravelAndSubsCostDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      numberOfTimes: isNumber(x.numberOfTimes) ? x.numberOfTimes : null,
      costOfEach: isNumber(x.costOfEach) ? x.costOfEach : null,
    }));
  }

  private mapOtherCosts(
    spendProfiles: PcrSpendProfileEntity[],
    costCategory: CostCategoryType,
  ): PCRSpendProfileOtherCostsDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
    }));
  }
}
