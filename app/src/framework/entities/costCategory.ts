import { CostCategoryType } from "@framework/constants";

export interface CostCategory {
  id: string;
  name: string;
  type: CostCategoryType;
  organisationType: string;
  competitionType: string;
  isCalculated: boolean;
  hasRelated: boolean;
  description: string;
  hintText: string;
  displayOrder: number;
  overrideAwardRate?: number;
}
