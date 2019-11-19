// tslint:disable:no-bitwise
import { ClaimFrequency } from "./claimFrequency";

export enum ProjectStatus {
    Unknown = 0,
    OfferLetterSent = 1,
    Live = 2,
    OnHold = 3,
    FinalClaim = 4,
    Closed = 5,
    Terminated = 6
}

export interface ProjectDto {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    summary: string;
    description: string;
    applicationUrl?: string | null;
    grantOfferLetterUrl?: string | null;
    projectNumber: string;
    leadPartnerName: string;

    claimFrequency: ClaimFrequency;
    claimFrequencyName: string;
    competitionType: string;

    periodId: number;
    totalPeriods: number | null;
    periodStartDate: Date | null;
    periodEndDate: Date | null;

    claimWindowStart: Date|null;
    claimWindowEnd: Date|null;

    grantOfferLetterCosts: number;
    costsClaimedToDate: number;
    claimedPercentage: number | null;

    roles: ProjectRole;
    roleTitles: string[];

    status: ProjectStatus;
    statusName: string;
    claimsToReview: number;
    claimsOverdue: number;
    claimsWithParticipant: number;
    numberOfOpenClaims: number;
    durationInMonths: number;
    numberOfPeriods: number;
}

export enum ProjectRole {
    Unknown = 0,
    MonitoringOfficer = 1 << 0,
    ProjectManager = 1 << 1,
    FinancialContact = 1 << 2,
}
