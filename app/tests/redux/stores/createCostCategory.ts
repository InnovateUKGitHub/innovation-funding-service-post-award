import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { CostCategoryType } from "@framework/entities";

export default (mod?: Partial<CostCategoryDto>): CostCategoryDto => {
  const template: CostCategoryDto = {
    id: "",
    name: "Labour",
    type: CostCategoryType.Labour,
    competitionType: "Sector" as any,
    description: "Labour",
    isCalculated: false,
    hasRelated: false,
    hintText: "",
    organisationType: "Industrial" as any
  };
  return { ...template, ...mod };
};
