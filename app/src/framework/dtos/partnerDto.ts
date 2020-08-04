import { ProjectRole } from "../dtos";

export enum PartnerClaimStatus {
  Unknown = 0,
  NoClaimsDue = 1,
  ClaimDue = 2,
  ClaimsOverdue = 3,
  ClaimQueried = 4,
  ClaimSubmitted = 5,
  IARRequired = 6
}

export enum PartnerStatus {
  Unknown = 0,
  Active = 1,
  OnHold = 2,
  InvoluntaryWithdrawal = 3,
  VoluntaryWithdrawal = 4,
  Pending = 5,
}

export enum BankCheckStatus {
  Unknown = 0,
  NotValidated = 10,
  ValidationPassed = 20,
  ValidationFailed = 30,
  VerificationPassed = 40,
  VerificationFailed = 50,
}

export enum SpendProfileStatus {
  Unknown = 0,
  ToDo = 10,
  Incomplete = 20,
  Complete = 30
}

export enum BankDetailsTaskStatus {
  Unknown = 0,
  ToDo = 10,
  Incomplete = 20,
  Complete = 30
}

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

interface BankDetails {
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

  postcode: string;
  isLead: boolean;
  isWithdrawn: boolean;
  projectRoleName: string;
  projectId: string;
  accountId: string;
  name: string;
  organisationType: string;
  competitionType: string;
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
  claimsOverdue: number | null;
  claimsWithParticipant: number | null;
  claimStatus: PartnerClaimStatus;
  statusName: string;
  totalCostsAwarded: number | null;
  auditReportFrequencyName: string;
  totalPrepayment: number | null;
  partnerStatus: PartnerStatus;
  percentageParticipantCostsSubmitted: number | null;
  totalFundingDueToReceive: number | null;

  overheadRate: number | null;
  newForecastNeeded: boolean | null;
  spendProfileStatus: SpendProfileStatus;
  spendProfileStatusLabel: string | null;
  bankDetailsTaskStatus: BankDetailsTaskStatus;
  bankDetailsTaskStatusLabel: string | null;
  bankCheckStatus: BankCheckStatus;

  // Bank details checks
  bankDetails: BankDetails;
  bankCheckValidationAttempts: number;
  validationResponse: ValidationResponse;
  verificationResponse: VerificationResponse;
}
