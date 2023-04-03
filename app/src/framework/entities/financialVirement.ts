import { LoanDto } from "@framework/dtos";

export interface LoanFinancialVirement extends Pick<LoanDto, "id" | "status" | "period"> {
  // Note: Derived from loan status

  currentDate: Date;
  currentValue: number;
  isEditable: boolean;
  newDate: Date;
  newValue: number;
}

export interface PartnerFinancialVirement {
  id: string;
  newEligibleCosts?: number;
  newFundingLevel: number;
  newRemainingGrant?: number;
  originalFundingLevel: number;
  partnerId: PartnerId;
  pcrItemId: string;
  virements: CostCategoryFinancialVirement[];
}

export interface CostCategoryFinancialVirement {
  costCategoryId: string;
  id: string;
  newEligibleCosts: number;
  originalCostsClaimedToDate: number;
  originalEligibleCosts: number;
  profileId: string;
}
