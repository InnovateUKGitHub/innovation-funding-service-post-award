export interface PartnerFinancialVirement {
  id: string;
  pcrItemId: string;
  partnerId: string;
  originalFundingLevel: number;
  newFundingLevel: number;
  virements: CostCategoryFinancialVirement[];
}

export interface CostCategoryFinancialVirement {
  id: string;
  profileId: string;
  costCategoryId: string;
  originalEligibleCosts: number;
  originalCostsClaimedToDate: number;
  newEligibleCosts: number;
}
