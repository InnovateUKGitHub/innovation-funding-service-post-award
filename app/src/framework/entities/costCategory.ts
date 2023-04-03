import { CostCategoryType, PCROrganisationType } from "@framework/constants";

export interface CostCategory {
  competitionType: string;
  description: string;
  displayOrder: number;
  hasRelated: boolean;
  hintText: string;
  id: string;
  isCalculated: boolean;
  name: string;
  organisationType: PCROrganisationType;
  overrideAwardRate?: number;
  type: CostCategoryType;
}
