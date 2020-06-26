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
}

// This is not a complete list, just the ones we need to know about (e.g. to show certain fields for adding a partner pcr)
export enum CostCategoryType {
  Unknown = 0,
  Academic = 5,
  Labour = 10,
  Overheads = 20,
  Materials = 30,
  Capital_Usage = 40,
  Subcontracting = 50,
  Travel_And_Subsistence = 60,
  Other_Costs = 70,
}
