export interface PcrSpendProfileEntityForCreate {
  pcrItemId: string;
  costCategoryId: string;
  value?: number;
  description?: string;

  // labour
  grossCostOfRole?: number;
  ratePerDay?: number;
  daysSpentOnProject?: number;

  // materials
  costPerItem?: number;
  quantity?: number;
}

export interface PcrSpendProfileEntity extends PcrSpendProfileEntityForCreate {
  id: string;
}
