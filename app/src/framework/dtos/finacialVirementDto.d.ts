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
  virements: VirementDto[];
}

interface VirementDto {
  costCategoryId: string;
  costCategoryName: string;
  originalAmount: number;
  currentAmount: number;
}