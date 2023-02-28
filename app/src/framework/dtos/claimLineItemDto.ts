export interface ClaimLineItemDto {
  id: string;
  description: string;
  value: number;
  partnerId: PartnerId;
  periodId: number;
  costCategoryId: string;
  lastModifiedDate: Date;
  isAuthor: boolean;
}
