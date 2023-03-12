import { CostCategoryType } from "@framework/constants";
import { CostCategoryList } from "@framework/types";

export const costCategoryTypeMapper = (organisationType: string, costCategoryType: string): CostCategoryType => {
  // Academic cost categories are always Academic.
  if (organisationType === "Academic") {
    return CostCategoryType.Academic;
  }

  return new CostCategoryList().fromName(costCategoryType).id;
};
