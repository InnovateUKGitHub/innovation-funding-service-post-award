import { CostCategoryType } from "@framework/entities";

export interface PcrSpendProfileDto {
  costs: PCRSpendProfileCostDto[];
}

export type PCRSpendProfileCostDto = PCRSpendProfileLabourCostDto | PCRSpendProfileStandardCostDto;

interface PCRSpendProfileBaseCostDto {
  costCategory: CostCategoryType;
  value: number;
}

export interface PCRSpendProfileLabourCostDto extends PCRSpendProfileBaseCostDto {
  costCategory: CostCategoryType.Labour;
}

// TODO remove this once all are mapped
export interface PCRSpendProfileStandardCostDto extends PCRSpendProfileBaseCostDto {
  costCategory: CostCategoryType.Unknown;
}
