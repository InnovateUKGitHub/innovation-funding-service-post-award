import { ClaimFrequency } from "./claimFrequency";

export interface ProjectDto {
    id: string;
    title: string;
    competition: string;
    startDate: Date;
    endDate: Date;
    summary: string;
    applicationUrl?: string|null;
    grantOfferLetterUrl?: string|null;
    projectNumber: string;

    claimFrequency: ClaimFrequency;
    period: number;
}
