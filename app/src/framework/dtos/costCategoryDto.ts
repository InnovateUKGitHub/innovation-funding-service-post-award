import { CostCategoryType } from "@framework/constants";

export interface CostCategoryDto {
  id: string;
  name: string;
  type: CostCategoryType;
  organisationType: string; // TODO:use PCROrganisationType enum
  competitionType: string;
  isCalculated: boolean;
  hasRelated: boolean;
  description: string;
  hintText: string;
  overrideAwardRate?: number;
}
