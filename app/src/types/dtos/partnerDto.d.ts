interface PartnerDto {
    id: string;
    type: string;
    isLead: boolean;
    projectId: string;
    accountId: string;
    name: string;
    totalParticipantGrant: number;
    totalParticipantCostsClaimed: number;
    awardRate: number;
    totalParticipantCostsPaid: number;
    percentageParticipantCostsClaimed: number | null;
    capLimit: number;
}
