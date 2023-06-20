import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { ClaimLineItemDto } from "./claimLineItemDto";

export interface ClaimDetailsSummaryDto {
  comments: string | null;
  costCategoryId: string;
  isAuthor: boolean;
  partnerId: PartnerId;
  periodEnd: Date | null;
  periodId: number;
  periodStart: Date | null;
  value: number;
  impactManagementParticipation: ImpactManagementParticipation;
}

export interface ClaimDetailsDto extends ClaimDetailsSummaryDto {
  lineItems: ClaimLineItemDto[];
}
