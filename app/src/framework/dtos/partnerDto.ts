import {
  BankCheckStatus,
  BankDetailsTaskStatus,
  PartnerClaimStatus,
  PartnerStatus,
  PostcodeTaskStatus,
  ProjectRole,
  SpendProfileStatus,
} from "@framework/constants";

interface ValidationResponse {
  validationCheckPassed: boolean;
  iban: string | null;
  validationConditionsSeverity: string | null;
  validationConditionsCode: string | null;
  validationConditionsDesc: string | null;
}
interface VerificationResponse {
  personalDetailsScore: number | null;
  addressScore: number | null;
  companyNameScore: number | null;
  regNumberScore: string | null;
  verificationConditionsSeverity: string | null;
  verificationConditionsCode: string | null;
  verificationConditionsDesc: string | null;
}

interface AccountAddress {
  accountPostcode: string | null;
  accountStreet: string | null;
  accountBuilding: string | null;
  accountLocality: string | null;
  accountTownOrCity: string | null;
}

export interface BankDetails {
  companyNumber: string | null;
  sortCode: string | null;
  accountNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  address: AccountAddress;
}

export interface PartnerDto {
  id: string;
  type: string;

  postcode: string | null;
  postcodeStatusLabel: string | null;
  postcodeStatus: PostcodeTaskStatus;
  isLead: boolean;
  isWithdrawn: boolean;
  projectRoleName: string;
  projectId: string;
  accountId: string;
  name: string;
  organisationType: string;
  competitionType: string;
  competitionName?: string;
  totalParticipantGrant: number | null;
  totalParticipantCostsClaimed: number | null;
  totalPaidCosts: number | null;
  awardRate: number | null;
  percentageParticipantCostsClaimed: number | null;
  capLimit: number | null;
  totalFutureForecastsForParticipants: number | null;
  totalCostsSubmitted: number | null;
  roles: ProjectRole;
  forecastLastModifiedDate: Date | null;
  overdueProject: boolean;
  claimsOverdue: number | null;
  claimsWithParticipant: number | null;
  claimStatus: PartnerClaimStatus;
  statusName: string;
  totalCostsAwarded: number | null;
  auditReportFrequencyName: string;
  totalPrepayment: number | null;
  partnerStatus: PartnerStatus;
  partnerStatusLabel: string;
  percentageParticipantCostsSubmitted: number | null;
  totalFundingDueToReceive: number | null;
  totalGrantApproved: number | null;
  remainingParticipantGrant: number | null;

  overheadRate: number | null;
  newForecastNeeded: boolean | null;
  spendProfileStatus: SpendProfileStatus;
  spendProfileStatusLabel: string | null;
  bankDetailsTaskStatus: BankDetailsTaskStatus;
  bankDetailsTaskStatusLabel: string | null;
  bankCheckStatus: BankCheckStatus;

  // Bank details checks
  bankDetails: BankDetails;
  bankCheckRetryAttempts: number;
  validationResponse: ValidationResponse;
  verificationResponse: VerificationResponse;

  isNonFunded: boolean;
}
