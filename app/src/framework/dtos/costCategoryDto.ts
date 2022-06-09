import { CostCategoryType } from "@framework/constants";
import { PCROrganisationType } from "@framework/constants";

export interface CostCategoryDto {
  id: string;
  name: string;
  type: CostCategoryType;
  organisationType: PCROrganisationType;
  competitionType: string;
  isCalculated: boolean;
  hasRelated: boolean;
  description: string;
  hintText: string;
  overrideAwardRate?: number;
}
