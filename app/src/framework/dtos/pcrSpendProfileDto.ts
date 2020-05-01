import { CostCategoryType } from "@framework/entities";

export interface PcrSpendProfileDto {
  costs: PCRSpendProfileCostDto[];
  pcrItemId: string;
}

export type PCRSpendProfileCostDto = PCRSpendProfileLabourCostDto | PCRSpendProfileMaterialsCostDto | PCRSpendProfileUnknownCostDto;

interface PCRSpendProfileBaseCostDto<T extends CostCategoryType> {
  id: string;
  costCategory: T;
  costCategoryId: string;
  value: number | null;
}

export interface PCRSpendProfileLabourCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Labour> {
  costCategory: CostCategoryType.Labour;
  role: string | null;
  grossCostOfRole: number | null;
  ratePerDay: number | null;
  daysSpentOnProject: number | null;
}

export interface PCRSpendProfileMaterialsCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Materials> {
  costCategory: CostCategoryType.Materials;
  item: string | null;
  quantity: number | null;
  costPerItem: number | null;
}

// TODO remove this once all are mapped
export interface PCRSpendProfileUnknownCostDto extends PCRSpendProfileBaseCostDto<CostCategoryType.Unknown> {
  costCategory: CostCategoryType.Unknown;
}
