import { CostCategoryType } from "@framework/entities";
import { PCRSpendProfileCapitalUsageType } from "@framework/types";

export interface PcrSpendProfileDto {
  costs: PCRSpendProfileCostDto[];
  pcrItemId: string;
}

export type PCRSpendProfileCostDto =
    PCRSpendProfileLabourCostDto
    | PCRSpendProfileMaterialsCostDto
    | PCRSpendProfileSubcontractingCostDto
    | PCRSpendProfileCapitalUsageCostDto
    | PCRSpendProfileTravelAndSubsCostDto
    | PCRSpendProfileUnknownCostDto;

interface PCRSpendProfileBaseCostDto<T extends CostCategoryType> {
  id: string;
  costCategory: T;
  costCategoryId: string;
  description: string | null;
  value: number | null;
}

export interface PCRSpendProfileLabourCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Labour> {
  costCategory: CostCategoryType.Labour;
  grossCostOfRole: number | null;
  ratePerDay: number | null;
  daysSpentOnProject: number | null;
}

export interface PCRSpendProfileMaterialsCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Materials> {
  costCategory: CostCategoryType.Materials;
  quantity: number | null;
  costPerItem: number | null;
}

export interface PCRSpendProfileSubcontractingCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Subcontracting> {
  costCategory: CostCategoryType.Subcontracting;
  subcontractorCountry: string | null;
  subcontractorRoleAndDescription: string | null;
}

export interface PCRSpendProfileCapitalUsageCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Capital_Usage> {
  costCategory: CostCategoryType.Capital_Usage;
  type: PCRSpendProfileCapitalUsageType;
  typeLabel: string | null;
  depreciationPeriod: number | null;
  netPresentValue: number | null;
  residualValue: number | null;
  utilisation: number | null;
}

export interface PCRSpendProfileTravelAndSubsCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Travel_And_Subsistence> {
  numberOfTimes: number | null;
  costOfEach: number | null;
}

// TODO remove this once all are mapped
export interface PCRSpendProfileUnknownCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Unknown> {
  costCategory: CostCategoryType.Unknown;
}
