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