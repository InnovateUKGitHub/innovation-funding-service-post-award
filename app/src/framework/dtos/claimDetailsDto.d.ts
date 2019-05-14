interface ClaimDetailsSummaryDto {
  id: string;
  costCategoryId: string;
  periodId: number;
  periodStart: Date | null;
  periodEnd: Date | null;
  value: number;
  comments: string | null;
}

interface ClaimDetailsDto extends ClaimDetailsSummaryDto {
  lineItems: ClaimLineItemDto[];
}
