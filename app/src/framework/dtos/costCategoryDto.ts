import { CostCategoryType } from "@framework/entities";

export interface CostCategoryDto {
  id: string;
  name: string;
  type: CostCategoryType;
  organisationType: string;
  competitionType: string;
  isCalculated: boolean;
  hasRelated: boolean;
  description: string;
  hintText: string;
}
