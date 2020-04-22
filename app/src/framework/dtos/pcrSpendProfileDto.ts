import { CostCategoryType } from "@framework/entities";

export interface PcrSpendProfileDto {
  costs: PCRSpendProfileCostDto[];
}

export type PCRSpendProfileCostDto = PCRSpendProfileLabourCostDto | PCRSpendProfileUnknownCostDto;

interface PCRSpendProfileBaseCostDto {
  id: string | null;
  costCategory: CostCategoryType;
  costCategoryId: string;
  value: number | null;
}

export interface PCRSpendProfileLabourCostDto extends PCRSpendProfileBaseCostDto {
  costCategory: CostCategoryType.Labour;
}

// TODO remove this once all are mapped
export interface PCRSpendProfileUnknownCostDto extends PCRSpendProfileBaseCostDto {
  costCategory: CostCategoryType.Unknown;
}
