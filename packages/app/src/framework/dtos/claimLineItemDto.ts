export interface ClaimLineItemDto {
  costCategoryId: CostCategoryId;
  description: string;
  id: string;
  isAuthor: boolean;
  lastModifiedDate: Date;
  partnerId: PartnerId;
  periodId: PeriodId;
  value: number;
}
