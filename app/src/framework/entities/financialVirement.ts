import { LoanDto } from "@framework/dtos";

export interface LoanFinancialVirement extends Pick<LoanDto, "id" | "status" | "period"> {
  // Note: Derived from loan status
  isEditable: boolean;

  currentDate: Date;
  currentValue: number;
  newDate: Date;
  newValue: number;
}

export interface PartnerFinancialVirement {
  id: string;
  pcrItemId: string;
  partnerId: string;
  originalFundingLevel: number;
  newFundingLevel: number;
  newEligibleCosts?: number;
  newRemainingGrant?: number;
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
