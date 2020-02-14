interface FinancialVirementDto {
  pcrItemId: string;

  originalEligibleCosts: number;
  originalCostsClaimed: number;
  originalCostsNotYetClaimed: number;
  originalRemaining: number;
  originalFundingLevel: number;

  newEligibleCosts: number;
  newCostsNotYetClaimed: number;
  newRemaining: number;
  newFundingLevel: number;

  differenceEligibleCosts: number;
  differenceRemaining: number;

  partners: PartnerVirementsDto[];
}

interface PartnerVirementsDto {
  partnerId: string;

  originalEligibleCosts: number;
  originalCostsClaimed: number;
  originalCostsNotYetClaimed: number;
  originalRemaining: number;
  originalFundingLevel: number;

  newEligibleCosts: number;
  newCostsNotYetClaimed: number;
  newRemaining: number;
  newFundingLevel: number;

  differenceEligibleCosts: number;
  differenceRemaining: number;

  virements: CostCategoryVirementDto[];
}

interface CostCategoryVirementDto {
  costCategoryId: string;
  costCategoryName: string;
  originalEligibleCosts: number;
  originalCostsClaimed: number;
  originalCostsNotYetClaimed: number;
  originalRemaining: number;
  newEligibleCosts: number;
  newCostsNotYetClaimed: number;
  newRemaining: number;
}
