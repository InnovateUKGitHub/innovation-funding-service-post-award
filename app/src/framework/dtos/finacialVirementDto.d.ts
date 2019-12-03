interface FinancialVirementDto {
  pcrItemId: string;
  originalTotal: number;
  currentTotal: number;
  partners: PartnerVirementsDto[]
}

interface PartnerVirementsDto {
  partnerId: string;
  partnerName: string;
  isLead: boolean;
  originalTotal: number;
  currentTotal: number;
  partnerVirements: VirementDto[];
}

interface VirementDto {
  costCategoryId: string;
  originalAmount: number;
  currentAmount: number;
}