import { ClaimStatus } from "@framework/constants/claimStatus";
import { ImpactManagementParticipation, ImpactManagementPhase } from "@framework/constants/competitionTypes";
import { ReceivedStatus } from "@framework/entities/received-status";

export interface ClaimDto {
  allowIarEdit: boolean;
  approvedDate: Date | null;
  comments: string | null;
  forecastCost: number;
  iarStatus: ReceivedStatus;
  id: string;
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

export interface ClaimStatusChangeDto {
  claimId: string;
  comments: string | null;
  createdBy: string;
  createdDate: Date;
  id: string;
  newStatus: ClaimStatus;
  newStatusLabel: string;
  previousStatus: ClaimStatus;
  previousStatusLabel: string;
}
