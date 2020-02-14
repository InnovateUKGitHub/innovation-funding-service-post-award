interface FinancialVirementDto {
  pcrItemId: string;

  originalEligibleCosts: number;
  originalCostsClaimed: number;
  originalCostsNotYetClaimed: number;
  originalRemaining: number;

  newEligibleCosts: number;
  newCostsNotYetClaimed: number;
  newRemaining: number;

  partners: PartnerVirementsDto[];
}

interface PartnerVirementsDto {
  partnerId: string;

  originalEligibleCosts: number;
  originalCostsClaimed: number;
  originalCostsNotYetClaimed: number;
  originalRemaining: number;

  newEligibleCosts: number;
  newCostsNotYetClaimed: number;
  newRemaining: number;

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
