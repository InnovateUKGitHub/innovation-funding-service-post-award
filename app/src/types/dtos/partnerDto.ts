import { ProjectRole } from ".";

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
}
