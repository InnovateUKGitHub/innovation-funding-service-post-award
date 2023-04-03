import { ClaimLineItemDto } from "@framework/types";

export interface ClaimDetailsSummaryDto {
  comments: string | null;
  costCategoryId: string;
  isAuthor: boolean;
  partnerId: PartnerId;
  periodEnd: Date | null;
  periodId: number;
  periodStart: Date | null;
  value: number;
}

export interface ClaimDetailsDto extends ClaimDetailsSummaryDto {
  lineItems: ClaimLineItemDto[];
}
