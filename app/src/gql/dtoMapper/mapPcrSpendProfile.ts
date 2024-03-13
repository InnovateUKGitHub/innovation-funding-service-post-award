import { CostCategoryGroupType, CostCategoryType } from "@framework/constants/enums";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import {
  PCRSpendProfileAcademicCostDto,
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PCRSpendProfileFundingDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileOtherFundingDto,
  PCRSpendProfileOverheadsCostDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
  PcrSpendProfileDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { PcrSpendProfileEntity } from "@framework/entities/pcrSpendProfile";
import { PcrSpendProfileOverheadRateMapper } from "@framework/mappers/spendProfileOverheadMapper";
import { PcrSpendProfileCapitalUsageTypeMapper } from "@framework/mappers/spendProfileTypeMapper";
import { CostCategoryList } from "@framework/types/CostCategory";
import { isNumber } from "lodash";
import { Clock } from "@framework/util/clock";
import { PCRSpendProfileCapitalUsageType, PCRSpendProfileOverheadRate } from "@framework/constants/pcrConstants";

const clock = new Clock();

// on Acc_IFSSpendProfile__c
export type PcrSpendProfileNode = GQL.PartialNode<{
  Id: string;
  Acc_CostCategoryID__c: GQL.Value<string>;
  Acc_ProjectChangeRequest__c: GQL.Value<string>;
  Acc_TotalCost__c: GQL.Value<number>;
  Acc_ItemDescription__c: GQL.Value<string>;
  Acc_DateSecured__c: GQL.Value<string>;

  // Labour
  Acc_GrossCostOfRole__c: GQL.Value<number>;
  Acc_DaysSpentOnProject__c: GQL.Value<number>;
  Acc_Rate__c: GQL.Value<number>;

  // Overheads
  Acc_OverheadRate__c: GQL.Value<string>;

  // Materials
  Acc_Quantity__c: GQL.Value<number>;
  Acc_CostPerItem__c: GQL.Value<number>;

  // Subcontracting
  Acc_Country__c: GQL.Value<string>;
  Acc_RoleAndDescription__c: GQL.Value<string>;

  // Capital Usage
  Acc_NewOrExisting__c: GQL.Value<string>;
  Acc_DepreciationPeriod__c: GQL.Value<number>;
  Acc_NetPresentValue__c: GQL.Value<number>;
  Acc_ResidualValue__c: GQL.Value<number>;
  Acc_Utilisation__c: GQL.Value<number>;

  // Travel and Subsistence
  Acc_NumberOfTimes__c: GQL.Value<number>;
  Acc_CostEach__c: GQL.Value<number>;
}>;

const itemMapper: GQL.DtoMapper<PcrSpendProfileEntity, PcrSpendProfileNode> = {
  id(node) {
    return node?.Id as CostId;
  },
  capitalUsageType(node) {
    return new PcrSpendProfileCapitalUsageTypeMapper().mapFromSalesforcePcrSpendProfileCapitalUsageType(
      node?.Acc_NewOrExisting__c?.value ?? null,
    );
  },
  costCategoryId(node) {
    return node?.Acc_CostCategoryID__c?.value as CostCategoryId;
  },
  costOfEach(node) {
    return node?.Acc_CostEach__c?.value ?? undefined;
  },
  costPerItem(node) {
    return node?.Acc_CostPerItem__c?.value ?? undefined;
  },
  dateOtherFundingSecured(node) {
    return node?.Acc_DateSecured__c?.value ?? undefined;
  },
  daysSpentOnProject(node) {
    return node?.Acc_DaysSpentOnProject__c?.value ?? undefined;
  },
  depreciationPeriod(node) {
    return node?.Acc_DepreciationPeriod__c?.value ?? undefined;
  },
  description(node) {
    return node?.Acc_ItemDescription__c?.value ?? null;
  },
  grossCostOfRole(node) {
    return node?.Acc_GrossCostOfRole__c?.value ?? undefined;
  },
  netPresentValue(node) {
    return node?.Acc_NetPresentValue__c?.value ?? undefined;
  },
  numberOfTimes(node) {
    return node?.Acc_NumberOfTimes__c?.value ?? undefined;
  },
  overheadRate(node) {
    return new PcrSpendProfileOverheadRateMapper().mapFromSalesforcePcrSpendProfileOverheadRateOption(
      node?.Acc_OverheadRate__c?.value ?? undefined,
    );
  },
  pcrItemId(node) {
    return node?.Acc_ProjectChangeRequest__c?.value as PcrItemId;
  },
  quantity(node) {
    return node?.Acc_Quantity__c?.value ?? undefined;
  },
  ratePerDay(node) {
    return node?.Acc_Rate__c?.value ?? undefined;
  },
  residualValue(node) {
    return node?.Acc_ResidualValue__c?.value ?? undefined;
  },
  subcontractorCountry(node) {
    return node?.Acc_Country__c?.value ?? undefined;
  },
  subcontractorRoleAndDescription(node) {
    return node?.Acc_RoleAndDescription__c?.value ?? undefined;
  },
  typeLabel(node) {
    return node?.Acc_NewOrExisting__c?.value ?? undefined;
  },
  utilisation(node) {
    return node?.Acc_Utilisation__c?.value ?? undefined;
  },
  value(node) {
    return node?.Acc_TotalCost__c?.value ?? null;
  },
};

/**
 * maps for a single pcr spend profile item
 */
export function mapPcrSpendProfileDto<T extends PcrSpendProfileNode, PickList extends keyof PcrSpendProfileEntity>(
  node: T,
  pickList: PickList[],
): Pick<PcrSpendProfileEntity, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = itemMapper[field](node);
    return dto;
  }, {} as Pick<PcrSpendProfileEntity, PickList>);
}

/**
 * maps for an array of spendProfiles
 */
export function mapPcrSpendProfileArray<T extends PcrSpendProfileNode, PickList extends keyof PcrSpendProfileEntity>(
  edges: ReadonlyArray<Readonly<GQL.Maybe<{ node: T | null }>>>,
  pickList: PickList[],
): Pick<PcrSpendProfileEntity, PickList>[] {
  return (
    edges?.map(node => {
      return mapPcrSpendProfileDto(node?.node ?? null, pickList);
    }) ?? []
  );
}

export class SpendProfile {
  constructor(private readonly pcrItemId: PcrItemId) {}

  getSpendProfile(
    spendProfiles: PcrSpendProfileEntity[],
    costCategories: Pick<CostCategoryDto, "type" | "id" | "name">[],
  ): PcrSpendProfileDto {
    return {
      pcrItemId: this.pcrItemId,
      costs: costCategories
        // For each cost category filter and map costs
        .flatMap(x =>
          this.mapCosts(
            x,
            spendProfiles.filter(s => s.costCategoryId === x.id),
          ),
        ),

      funds: costCategories
        // For each cost category filter and map funds
        .flatMap(x =>
          this.mapFunds(
            x,
            spendProfiles.filter(s => s.costCategoryId === x.id && s.dateOtherFundingSecured),
          ),
        ),
    };
  }

  private mapCosts(
    costCategory: Pick<CostCategoryDto, "type">,
    spendProfiles: PcrSpendProfileEntity[],
  ): PCRSpendProfileCostDto[] {
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
      case CostCategoryGroupType.Other_Costs:
        return this.mapOtherCosts(spendProfiles, costCategoryType.id);
      default:
        return [];
    }
  }

  private mapFunds(
    costCategory: Pick<CostCategoryDto, "type">,
    spendProfiles: PcrSpendProfileEntity[],
  ): PCRSpendProfileFundingDto[] {
    const costCategoryType = new CostCategoryList().fromId(costCategory.type);
    if (costCategoryType.group === CostCategoryGroupType.Other_Funding) {
      return this.mapOtherFunding(spendProfiles, costCategory.type);
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
    spendProfiles: PcrSpendProfileEntity[],
    costCategory: CostCategoryType,
  ): PCRSpendProfileOtherFundingDto[] {
    return spendProfiles.map(x => ({
      ...this.mapBaseCostFields(x),
      costCategory,
      dateSecured: clock.parseOptionalSalesforceDate(x.dateOtherFundingSecured || null),
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
