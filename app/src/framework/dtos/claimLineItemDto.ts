export interface ClaimLineItemDto {
  id: string;
  description: string;
  value: number;
  partnerId: string;
  periodId: number;
  costCategoryId: string;
  lastModifiedDate: Date;
}
