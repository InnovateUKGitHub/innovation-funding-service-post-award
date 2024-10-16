import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { ClaimFrequency } from "@framework/constants/enums";
import {
  ProjectMonitoringLevel,
  ProjectRolePermissionBits,
  ProjectSource,
  ProjectStatus,
  TypeOfAid,
} from "@framework/constants/project";

export interface ProjectDto {
  applicationUrl?: string | null;
  claimedPercentage: number | null;
  claimFrequency: ClaimFrequency;
  claimFrequencyName: string;
  claimsOverdue: number;
  claimsToReview: number;
  claimsWithParticipant: number;
  competitionType: string;
  costsClaimedToDate: number;
  description: string;
  durationInMonths: number;
  endDate: Date;
  grantOfferLetterCosts: number;
  grantOfferLetterUrl?: string | null;
  id: ProjectId;
  isNonFec: boolean;
  isPastEndDate: boolean;
  leadPartnerName: string;
  loanAvailabilityPeriodLength: number | null;
  loanEndDate: Date | null;
  loanExtensionPeriodLength: number | null;
  loanRepaymentPeriodLength: number | null;
  monitoringLevel: ProjectMonitoringLevel;
  numberOfOpenClaims: number;
  numberOfPeriods: number;
  pcrsQueried: number;
  pcrsToReview: number;
  periodEndDate: Date | null;
  periodId: PeriodId;
  periodStartDate: Date | null;
  projectNumber: string;
  roles: ProjectRolePermissionBits | SfRoles;
  roleTitles: string[];
  startDate: Date | null;
  status: ProjectStatus;
  statusName: string;
  summary: string;
  title: string;
  projectSource: ProjectSource;
  impactManagementParticipation: ImpactManagementParticipation;
}

export interface ProjectDtoGql extends ProjectDto {
  isActive: boolean;
  partnerRoles: SfPartnerRoles[];
  roles: SfRoles;
  leadPartnerId: string | null;
  typeOfAid: TypeOfAid;
  competitionName: string;
}
