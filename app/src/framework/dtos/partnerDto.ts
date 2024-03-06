import {
  BankCheckStatus,
  BankDetailsTaskStatus,
  PartnerClaimStatus,
  PartnerStatus,
  PostcodeTaskStatus,
  SpendProfileStatus,
} from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";

interface ValidationResponse {
  iban: string | null;
  validationCheckPassed: boolean;
  validationConditionsCode: string | null;
  validationConditionsDesc: string | null;
  validationConditionsSeverity: string | null;
}
interface VerificationResponse {
  addressScore: number | null;
  companyNameScore: number | null;
  personalDetailsScore: number | null;
  regNumberScore: string | null;
  verificationConditionsCode: string | null;
  verificationConditionsDesc: string | null;
  verificationConditionsSeverity: string | null;
}

interface AccountAddress {
  accountBuilding: string | null;
  accountLocality: string | null;
  accountPostcode: string | null;
  accountStreet: string | null;
  accountTownOrCity: string | null;
}

export interface BankDetails {
  accountNumber: string | null;
  address: AccountAddress;
  companyNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  sortCode: string | null;
}

export interface PartnerBankDetailsDto {
  accountId: string;
  bankDetails: BankDetails;
  id: string;
}

export interface PartnerDto {
  accountId: string;
  auditReportFrequencyName: string;
  awardRate: number | null;
  bankCheckRetryAttempts: number;
  bankCheckStatus: BankCheckStatus;
  bankDetails: BankDetails;
  bankDetailsTaskStatus: BankDetailsTaskStatus;
  bankDetailsTaskStatusLabel: string | null;
  capLimit: number | null;
  capLimitDeferredAmount: number | null;
  capLimitDeferredGrant: number | null;
  claimsOverdue: number | null;
  claimStatus: PartnerClaimStatus;
  claimsWithParticipant: number | null;
  competitionName?: string;
  competitionType: string;
  forecastLastModifiedDate: Date | null;
  id: PartnerId;
  isLead: boolean;
  isNonFunded: boolean;
  isWithdrawn: boolean;
  name: string;
  newForecastNeeded: boolean | null;
  organisationType: string;
  overdueProject: boolean;
  overheadRate: number | null;
  partnerStatus: PartnerStatus;
  partnerStatusLabel: string;
  percentageParticipantCostsClaimed: number | null;
  percentageParticipantCostsSubmitted: number | null;
  postcode: string | null;
  postcodeStatus: PostcodeTaskStatus;
  postcodeStatusLabel: string | null;
  projectId: ProjectId;
  projectRoleName: string;
  remainingParticipantGrant: number | null;
  roles: ProjectRole | SfRoles;
  spendProfileStatus: SpendProfileStatus;
  spendProfileStatusLabel: string | null;
  statusName: string;
  totalCostsAwarded: number | null;
  totalCostsSubmitted: number | null;
  totalFundingDueToReceive: number | null;
  totalFutureForecastsForParticipants: number | null;
  totalGrantApproved: number | null;
  totalPaidCosts: number | null;
  totalParticipantCostsClaimed: number | null;
  totalParticipantGrant: number | null;
  totalPrepayment: number | null;
  type: string;
  validationResponse: ValidationResponse;
  verificationResponse: VerificationResponse;
}

export interface PartnerDtoGql extends PartnerDto {
  forecastsAndCosts: number;
  capLimitGrant: number;
  roles: SfRoles;
  openClaimPeriodNumber: number;
  isFlagged: boolean;
}
