export interface PartnerFinancialVirement {
  id: string;
  pcrItemId: string;
  partnerId: string;
  virements: CostCategoryFinancialVirement[];
}

export interface CostCategoryFinancialVirement {
  id: string;
  profileId: string;
  costCategoryId: string;
  originalEligibleCosts: number;
  originalCostsClaimedToDate: number;
  newCosts: number;
}
