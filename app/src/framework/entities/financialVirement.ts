import { LoanDto } from "@framework/dtos/loanDto";

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
  pcrItemId: PcrItemId;
  virements: CostCategoryFinancialVirement[];
}

export interface CostCategoryFinancialVirement {
  costCategoryId: CostCategoryId;
  id: string;
  newEligibleCosts: number;
  originalCostsClaimedToDate: number;
  originalEligibleCosts: number;
  profileId: string;
}
