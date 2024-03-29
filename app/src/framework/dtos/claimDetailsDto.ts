import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { ClaimLineItemDto } from "./claimLineItemDto";

export interface ClaimDetailsSummaryDto {
  comments: string | null;
  costCategoryId: CostCategoryId;
  isAuthor: boolean;
  partnerId: PartnerId;
  periodEnd: Date | null;
  periodId: PeriodId;
  periodStart: Date | null;
  value: number;
  grantPaidToDate: number;
  impactManagementParticipation: ImpactManagementParticipation;
}

export interface ClaimDetailsDto extends ClaimDetailsSummaryDto {
  lineItems: ClaimLineItemDto[];
}
