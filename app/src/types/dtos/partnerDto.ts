import { ProjectRole } from ".";

export enum PartnerClaimStatus {
  Unknown = 0,
  NoClaimsDue = 1,
  ClaimDue = 2,
  ClaimsOverdue = 3,
  ClaimQueried = 4,
  ClaimSubmitted = 5,
  IARRequired = 6
}

export interface PartnerDto {
  id: string;
  type: string;
  isLead: boolean;
  projectId: string;
  accountId: string;
  name: string;

  organisationType: string;
  totalParticipantGrant: number | null;
  totalParticipantCostsClaimed: number | null;
  awardRate: number | null;
  percentageParticipantCostsClaimed: number | null;
  capLimit: number | null;
  totalFutureForecastsForParticipants: number | null;
  roles: ProjectRole;
  forecastLastModifiedDate: Date | null;
  claimsToReview: number;
  claimsOverdue: number;
  claimsQuried: number;
  status: PartnerClaimStatus;
  statusName: string;
}
