export interface PcrSpendProfileEntityForCreate {
  pcrItemId: string;
  costCategoryId: string;
  value?: number;

  // labour
  role?: string;
  grossCostOfRole?: number;
  ratePerDay?: number;
  daysSpentOnProject?: number;

  // materials
  item?: string;
  costPerItem?: number;
  quantity?: number;
}

export interface PcrSpendProfileEntity extends PcrSpendProfileEntityForCreate {
  id: string;
}
