import { FinancialVirementDto, PartnerDto, PartnerVirementsDto, PCRItemDto } from "@framework/dtos";

/**
 * Available PCR Summary Payloads - Consumable via context (due to split workflow UI's)
 */
export interface PcrSummaryEmpty {
  isSummaryValid: boolean;
  data: null;
}

export interface ProjectReallocationCosts {
  partner: PartnerDto;
  partnerVirement: PartnerVirementsDto;
}

export interface PcrSummaryMultiplePartnerFinancialVirement {
  isSummaryValid: boolean;
  data: {
    totalOriginalGrant: number;
    totalNewGrant: number;
    hasAvailableGrant: boolean;
    hasMatchingGrant: boolean;
    newGrantDifference: number;
    projectCostsOfPartners: ProjectReallocationCosts[];
  };
}

export type PcrSummaryResponse = (PcrSummaryEmpty | PcrSummaryMultiplePartnerFinancialVirement) & {
  allowSubmit: boolean;
  handleSubmitDisplay: (enableSubmit: boolean) => void;
};

/**
 * Required Arguments for PcrSummary
 */
export interface SummaryLogicProps {
  partners: PartnerDto[];
  virement: FinancialVirementDto;
}

export interface PcrSummaryProps extends SummaryLogicProps {
  type: PCRItemDto["type"];
}
