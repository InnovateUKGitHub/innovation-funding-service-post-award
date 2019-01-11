import { ProjectRole } from ".";

export interface PartnerDto {
    id: string;
    type: string;
    isLead: boolean;
    projectId: string;
    accountId: string;
    name: string;
    totalParticipantGrant: number;
    totalParticipantCostsClaimed: number;
    awardRate: number;
    percentageParticipantCostsClaimed: number | null;
    capLimit: number;
    totalFutureForecastsForParticipants: number;
    roles: ProjectRole;
    lastModifiedDate: Date|null;
}
