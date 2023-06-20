import { CostCategoryType } from "@framework/constants/enums";
import { PCROrganisationType } from "@framework/constants/pcrConstants";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";

export default (mod?: Partial<CostCategoryDto>): CostCategoryDto => {
  const template: CostCategoryDto = {
    id: "",
    name: "Labour",
    type: CostCategoryType.Labour,
    competitionType: "Sector",
    description: "Labour",
    isCalculated: false,
    hasRelated: false,
    hintText: "",
    organisationType: PCROrganisationType.Industrial,
  };
  return { ...template, ...mod };
};
