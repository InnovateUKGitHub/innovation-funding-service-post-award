export interface ClaimLineItemDto {
  id: string;
  description: string | null;
  value: number | null;
  partnerId: string;
  periodId: number;
  costCategoryId: string;
}
