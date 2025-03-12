import { ClaimStatus } from "@framework/constants/claimStatus";
import { ImpactManagementParticipation, ImpactManagementPhase } from "@framework/constants/competitionTypes";
import { ReceivedStatus } from "@framework/entities/received-status";
import { ClaimReviewSchemaType } from "@ui/pages/claims/claimReview/claimReview.zod";
import { ClaimSummarySchemaType } from "@ui/pages/claims/claimSummary.zod";
import { ClaimForecastSchemaType } from "@ui/pages/claims/forecast/ClaimForecast.zod";
import { z } from "zod";

export interface ClaimDto {
  allowIarEdit: boolean;
  approvedDate: Date | null;
  comments: string | null;
  forecastCost: number;
  iarStatus: ReceivedStatus;
  id: ClaimId;
  grantPaidToDate: number;
  isApproved: boolean;
  isFinalClaim: boolean;
  isIarRequired: boolean;
  lastModifiedDate: Date;
  overheadRate: number;
  paidDate: Date | null;
  partnerId: PartnerId;
  pcfStatus: ReceivedStatus;
  periodCostsToBePaid: number;
  periodEndDate: Date;
  periodId: PeriodId;
  periodStartDate: Date;
  status: ClaimStatus;
  statusLabel: string;
  totalCost: number;
  totalCostsApproved: number;
  totalCostsSubmitted: number;
  totalDeferredAmount: number;
  impactManagementParticipation: ImpactManagementParticipation;
  impactManagementPhasedCompetition: boolean;
  impactManagementPhasedCompetitionStage: ImpactManagementPhase;
}

export interface ClaimDtoGql extends ClaimDto {
  newCapLimitDeferredGrant: number;
}

export interface ClaimStatusChangeDto {
  claimId: ClaimId;
  comments: string | null;
  createdBy: string;
  createdDate: Date;
  id: string;
  newStatus: ClaimStatus;
  newStatusLabel: string;
  previousStatus: ClaimStatus;
  previousStatusLabel: string;
}

export type ClaimUpdateForecastDto = z.output<ClaimForecastSchemaType>;

export type ClaimSummaryDto = z.output<ClaimSummarySchemaType>;

export type ClaimReviewDto = z.output<ClaimReviewSchemaType>;
