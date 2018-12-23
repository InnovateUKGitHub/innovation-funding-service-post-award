import { ClaimFrequency } from "./claimFrequency";

export interface ProjectDto {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    summary: string;
    applicationUrl?: string | null;
    grantOfferLetterUrl?: string | null;
    projectNumber: string;

    claimFrequency: ClaimFrequency;
    claimFrequencyName: string;
    periodId: number;
    totalPeriods: number | null;
    periodStartDate: Date | null;
    periodEndDate: Date | null;

    grantOfferLetterCosts: number;
    costsClaimedToDate: number;
    claimedPercentage: number | null;

    roles: ProjectRole;
    roleTitles: string[];
}

export enum ProjectRole {
    Unknown = 0,
    MonitoringOfficer = 1 << 0,
    ProjectManager = 1 << 1,
    FinancialContact = 1 << 2,
};
