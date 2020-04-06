interface FinancialVirementDto {
  pcrItemId: string;
  costsClaimedToDate: number;

  originalEligibleCosts: number;
  originalRemainingCosts: number;
  originalFundingLevel: number;
  originalRemainingGrant: number;

  newEligibleCosts: number;
  newRemainingCosts: number;
  newFundingLevel: number;
  newRemainingGrant: number;

  partners: PartnerVirementsDto[];
}

interface PartnerVirementsDto {
  partnerId: string;
  costsClaimedToDate: number;

  originalEligibleCosts: number;
  originalRemainingCosts: number;
  originalFundingLevel: number;
  originalRemainingGrant: number;

  newEligibleCosts: number;
  newRemainingCosts: number;
  newFundingLevel: number;
  newRemainingGrant: number;

  virements: CostCategoryVirementDto[];
}

interface CostCategoryVirementDto {
  costCategoryId: string;
  costCategoryName: string;
  costsClaimedToDate: number;
  originalEligibleCosts: number;
  originalRemainingCosts: number;
  newEligibleCosts: number;
  newRemainingCosts: number;
}
