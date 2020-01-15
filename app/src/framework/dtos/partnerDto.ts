import { ProjectRole } from "../dtos";

export enum PartnerClaimStatus {
  Unknown = 0,
  NoClaimsDue = 1,
  ClaimDue = 2,
  ClaimsOverdue = 3,
  ClaimQueried = 4,
  ClaimSubmitted = 5,
  IARRequired = 6
}

export enum PartnerStatus {
  Unknown = 0,
  Active = 1,
  OnHold = 2,
  InvoluntaryWithdrawal = 3,
  VoluntaryWithdrawal = 4,
}

export interface PartnerDto {
  id: string;
  type: string;
  isLead: boolean;
  isWithdrawn: boolean;
  projectRoleName: string;
  projectId: string;
  accountId: string;
  name: string;
  organisationType: string;
  competitionType: string;
  totalParticipantGrant: number | null;
  totalParticipantCostsClaimed: number | null;
  totalPaidCosts: number | null;
  awardRate: number | null;
  percentageParticipantCostsClaimed: number | null;
  capLimit: number | null;
  totalFutureForecastsForParticipants: number | null;
  totalCostsSubmitted: number | null;
  roles: ProjectRole;
  forecastLastModifiedDate: Date | null;
  claimsOverdue: number | null;
  claimsWithParticipant: number | null;
  claimStatus: PartnerClaimStatus;
  statusName: string;
  totalCostsAwarded: number | null;
  auditReportFrequencyName: string;
  totalPrepayment: number | null;
  partnerStatus: PartnerStatus;
  percentageParticipantCostsSubmitted: number | null;
  totalFundingDueToReceive: number | null;

  overheadRate: number | null;
}
