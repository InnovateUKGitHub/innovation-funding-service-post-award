export interface PcrSpendProfileEntityForCreate {
  pcrItemId: string;
  costCategoryId: string;
  costOfRole?: number;
}

export interface PcrSpendProfileEntity extends PcrSpendProfileEntityForCreate {
  id: string;
}
