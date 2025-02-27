import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { ClaimLineItemDto } from "./claimLineItemDto";
import { z } from "zod";
import type { EditClaimLineItemsSchemaType } from "@ui/pages/claims/claimLineItems/editClaimLineItems.zod";

export interface ClaimDetailsSummaryDto {
  id: ClaimId;
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

export type ClaimLineItemsDto = z.output<EditClaimLineItemsSchemaType>;
