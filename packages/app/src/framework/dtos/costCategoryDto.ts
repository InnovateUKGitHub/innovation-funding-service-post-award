import { CostCategoryType } from "@framework/constants/enums";
import { PCROrganisationType } from "@framework/constants/pcrConstants";

export interface CostCategoryDto {
  competitionType: string;
  description: string;
  hasRelated: boolean;
  hintText: string;
  id: CostCategoryId;
  isCalculated: boolean;
  name: string;
  organisationType: PCROrganisationType;
  overrideAwardRate?: number;
  type: CostCategoryType;
}
