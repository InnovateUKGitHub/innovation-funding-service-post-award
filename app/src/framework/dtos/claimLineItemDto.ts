export interface ClaimLineItemDto {
  costCategoryId: string;
  description: string;
  id: string;
  isAuthor: boolean;
  lastModifiedDate: Date;
  partnerId: PartnerId;
  periodId: number;
  value: number;
}
