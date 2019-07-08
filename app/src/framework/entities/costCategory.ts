export interface CostCategory {
  id: string;
  name: string;
  organisationType: string;
  competitionType: string;
  isCalculated: boolean;
  hasRelated: boolean;
  description: string;
  hintText: string;
  displayOrder: number;
}
