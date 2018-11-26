import { ClaimFrequency } from "./claimFrequency";

export interface ProjectDto {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    summary: string;
    applicationUrl?: string|null;
    grantOfferLetterUrl?: string|null;
    projectNumber: string;

    claimFrequency: ClaimFrequency;
    claimFrequencyName: string;
    periodId: number;

    grantOfferLetterCosts: number;
    costsClaimedToDate: number;

}
