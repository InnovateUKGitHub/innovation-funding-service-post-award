import { ClaimLineItemDto } from "@framework/types";

export interface ClaimDetailsSummaryDto {
  partnerId: PartnerId;
  costCategoryId: string;
  periodId: number;
  periodStart: Date | null;
  periodEnd: Date | null;
  value: number;
  comments: string | null;
  isAuthor: boolean;
}

export interface ClaimDetailsDto extends ClaimDetailsSummaryDto {
  lineItems: ClaimLineItemDto[];
}
