import { LoanFinancialVirement } from "@framework/entities";

export interface FinancialLoanVirementDto {
  loans: LoanFinancialVirement[];
  pcrItemId: PcrItemId;
}

export interface FinancialVirementDto {
  costsClaimedToDate: number;
  currentPartnerId?: PartnerId;
  newEligibleCosts: number;
  newFundingLevel: number;
  newRemainingCosts: number;
  newRemainingGrant: number;
  originalEligibleCosts: number;
  originalFundingLevel: number;
  originalRemainingCosts: number;
  originalRemainingGrant: number;
  partners: PartnerVirementsDto[];
  pcrItemId: PcrItemId;
}

export interface PartnerVirementsDto {
  costsClaimedToDate: number;
  newEligibleCosts: number;
  newFundingLevel: number;
  newRemainingCosts: number;
  newRemainingGrant: number;
  originalEligibleCosts: number;
  originalFundingLevel: number;
  originalRemainingCosts: number;
  originalRemainingGrant: number;
  partnerId: PartnerId;
  virements: CostCategoryVirementDto[];
}

export interface CostCategoryVirementDto {
  costCategoryId: string;
  costCategoryName: string;
  costsClaimedToDate: number;
  newEligibleCosts: number;
  newRemainingCosts: number;
  newRemainingGrant: number;
  originalEligibleCosts: number;
  originalRemainingCosts: number;
  originalRemainingGrant: number;
}
