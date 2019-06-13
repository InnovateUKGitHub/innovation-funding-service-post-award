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

export interface PartnerDto {
  id: string;
  type: string;
  isLead: boolean;
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
  roles: ProjectRole;
  forecastLastModifiedDate: Date | null;
  claimsOverdue: number | null;
  claimsWithParticipant: number | null;
  status: PartnerClaimStatus;
  statusName: string;

  overheadRate: number | null;
}
