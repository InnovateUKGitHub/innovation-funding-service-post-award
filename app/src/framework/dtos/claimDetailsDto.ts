import { ClaimLineItemDto } from "@framework/types";

export interface ClaimDetailsSummaryDto {
  partnerId: string;
  costCategoryId: string;
  periodId: number;
  periodStart: Date | null;
  periodEnd: Date | null;
  value: number;
  comments: string | null;
  createdByMe: boolean;
}

export interface ClaimDetailsDto extends ClaimDetailsSummaryDto {
  lineItems: ClaimLineItemDto[];
}
