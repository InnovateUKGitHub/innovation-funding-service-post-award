import { PCROrganisationType } from "@framework/constants/pcrConstants";

export interface Partner {
  accountBuilding: string;
  accountId: string;
  accountLocality: string;
  accountNumber: string;
  accountPostcode: string;
  accountStreet: string;
  accountTownOrCity: string;
  addressScore: number | null;
  auditReportFrequency: string;
  auditReportFrequencyName: string;
  awardRate: number;
  bankCheckStatus: string;
  bankDetailsTaskStatus: string;
  bankDetailsTaskStatusLabel: string;
  capLimit: number;
  capLimitDeferredAmount: number;
  capLimitDeferredGrant: number;
  claimsForReview: number;
  claimsOverdue: number;
  claimsUnderQuery: number;
  companyNameScore: number | null;
  companyNumber: string;
  competitionName?: string;
  competitionType: string;
  firstName: string;
  forecastLastModifiedDate: Date | null;
  iban: string;
  id: PartnerId;
  isNonFunded: boolean;
  lastName: string;
  name: string;
  newForecastNeeded: boolean;
  organisationType: PCROrganisationType;
  overdueProject: boolean;
  overheadRate: number;
  participantSize: string;
  participantStatus: string;
  participantStatusLabel: string;
  participantType: string;
  personalDetailsScore: number | null;
  postcode: string | null;
  postcodeStatus: string;
  postcodeStatusLabel: string | null;
  projectId: ProjectId;
  projectRole: string;
  projectRoleName: string;
  regNumberScore: string | null;
  remainingParticipantGrant: number;
  sortCode: string;
  spendProfileStatus: string;
  spendProfileStatusLabel: string;
  totalApprovedCosts: number;
  totalCostsAwarded: number;
  totalCostsSubmitted: number;
  totalFutureForecastsForParticipant: number;
  totalGrantApproved: number;
  totalPaidCosts: number;
  totalParticipantCosts: number;
  totalPrepayment: number;
  trackingClaims: string;
  validationCheckPassed: boolean;
  validationConditionsCode: string;
  validationConditionsDesc: string;
  validationConditionsSeverity: string;
  verificationConditionsCode: string;
  verificationConditionsDesc: string;
  verificationConditionsSeverity: string;
}

export type PartnerBankDetails = Pick<
  Partner,
  | "accountBuilding"
  | "accountId"
  | "accountLocality"
  | "accountNumber"
  | "accountPostcode"
  | "accountStreet"
  | "accountTownOrCity"
  | "companyNumber"
  | "firstName"
  | "id"
  | "lastName"
  | "sortCode"
>;
