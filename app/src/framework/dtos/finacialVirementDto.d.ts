interface FinancialVirementDto {
  pcrItemId: string;

  totalEligibleCosts: number;
  totalCostsClaimed: number;
  totalCostsNotYetClaimed: number;
  totalRemaining: number;

  newEligibleCosts: number;
  newCostsNotYetClaimed: number;
  newRemaining: number;

  partners: PartnerVirementsDto[];
}

interface PartnerVirementsDto {
  partnerId: string;

  totalEligibleCosts: number;
  totalCostsClaimed: number;
  totalCostsNotYetClaimed: number;
  totalRemaining: number;

  newEligibleCosts: number;
  newCostsNotYetClaimed: number;
  newRemaining: number;

  virements: VirementDto[];
}

interface VirementDto {
  costCategoryId: string;
  costCategoryName: string;
  totalEligibleCosts: number;
  totalCostsClaimed: number;
  totalCostsNotYetClaimed: number;
  totalRemaining: number;
  newEligibleCosts: number;
  newCostsNotYetClaimed: number;
  newRemaining: number;
}
