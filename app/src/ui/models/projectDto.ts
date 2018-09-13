import { ClaimFrequency } from "./claimFrequency";

export interface ProjectDto {
    id: string;
    title: string|null;
    competition: string|null;
    startDate: Date|null;
    endDate: Date|null;
    summary: string|null;
    applicationUrl?: string|null;
    grantOfferLetterUrl?: string|null;
    projectNumber: string|null;

    claimFrequency: ClaimFrequency;
    period: number;
}
