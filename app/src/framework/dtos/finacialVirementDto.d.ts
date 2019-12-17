interface FinancialVirementDto {
  pcrItemId: string;
  originalTotal: number;
  newTotal: number;
  partners: PartnerVirementsDto[]
}

interface PartnerVirementsDto {
  partnerId: string;
  partnerName: string;
  isLead: boolean;
  originalTotal: number;
  newTotal: number;
  virements: VirementDto[];
}

interface VirementDto {
  costCategoryId: string;
  costCategoryName: string;
  originalAmount: number;
  newAmount: number;
}

interface FinancialVirementV2Dto {
  pcrItemId: string;
  difference: number;
  additions: VirementV2Dto[];
  subtractions: VirementV2Dto[];
}

interface VirementV2Dto {
  partnerId: string;
  costCategoryId: string;
  originalAmount: number;
  newAmount: number;
  difference: number;
}
