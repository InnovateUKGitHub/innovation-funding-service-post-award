import { ClaimFrequency, ProjectRole, ProjectStatus } from "@framework/constants";

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

  isPastEndDate: boolean;
  periodId: number;
  periodStartDate: Date | null;
  periodEndDate: Date | null;

  pcrsQueried: number;
  pcrsToReview: number;

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
  isNonFec: boolean;

  loanEndDate: Date | null;
  loanAvailabilityPeriodLength: number | null;
  loanExtensionPeriodLength: number | null;
  loanRepaymentPeriodLength: number | null;
}
