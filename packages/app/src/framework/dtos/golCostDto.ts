import { CostCategoryType } from "@framework/constants/enums";

export interface GOLCostDto {
  costCategoryId: CostCategoryId;
  costCategoryName: string;
  value: number;
  type: CostCategoryType;
}
