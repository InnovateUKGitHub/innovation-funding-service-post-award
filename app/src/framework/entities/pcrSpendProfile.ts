export interface PcrSpendProfileEntityForCreate {
  pcrItemId: string;
  costCategoryId: string;
  costOfRole?: number;
  role?: string;
  grossCostOfRole?: number;
  ratePerDay?: number;
  daysSpentOnProject?: number;
}

export interface PcrSpendProfileEntity extends PcrSpendProfileEntityForCreate {
  id: string;
}
