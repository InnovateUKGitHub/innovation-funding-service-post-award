export interface ClaimLineItemDto {
  createdDate: Date;
  costCategoryId: CostCategoryId;
  description: string;
  id: ClaimId;
  isAuthor: boolean;
  lastModifiedDate: Date;
  partnerId: PartnerId;
  periodId: PeriodId;
  value: number;
}
