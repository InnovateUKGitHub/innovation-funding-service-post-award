import { CostCategoryType } from "@framework/constants";
import { CostCategoryList } from "@framework/types";

export const costCategoryTypeMapper = (name: string): CostCategoryType => {
  // Academic cost categories are always Academic.
  if (name === "Academic") {
    return CostCategoryType.Academic;
  }

  return new CostCategoryList().fromName(name).id;
};
