import { PCROrganisationType } from "@framework/constants";
export interface Partner {
  id: string;
  accountId: string;
  name: string;
  organisationType: PCROrganisationType;
  participantType: string;
  participantSize: string;
  projectRole: string;
  projectRoleName: string;
  projectId: string;
  competitionType: string;
  competitionName?: string;
  totalParticipantCosts: number;
  totalApprovedCosts: number;
  capLimit: number;
  awardRate: number;
  totalPaidCosts: number;
  totalFutureForecastsForParticipant: number;
  forecastLastModifiedDate: Date | null;
  claimsForReview: number;
  overdueProject: boolean;
  claimsOverdue: number;
  claimsUnderQuery: number;
  trackingClaims: string;
  overheadRate: number;
  participantStatus: string;
  participantStatusLabel: string;
  totalCostsSubmitted: number;
  totalCostsAwarded: number;
  auditReportFrequency: string;
  auditReportFrequencyName: string;
  totalPrepayment: number;
  postcode: string | null;
  postcodeStatusLabel: string | null;
  postcodeStatus: string;
  newForecastNeeded: boolean;

  // project setup
  companyNumber: string;
  sortCode: string;
  accountNumber: string;
  firstName: string;
  lastName: string;
  accountPostcode: string;
  accountStreet: string;
  accountBuilding: string;
  accountLocality: string;
  accountTownOrCity: string;

  spendProfileStatus: string;
  spendProfileStatusLabel: string;
  bankDetailsTaskStatus: string;
  bankDetailsTaskStatusLabel: string;
  bankCheckStatus: string;
  validationCheckPassed: boolean;
  iban: string;
  validationConditionsSeverity: string;
  validationConditionsCode: string;
  validationConditionsDesc: string;
  personalDetailsScore: number | null;
  addressScore: number | null;
  companyNameScore: number | null;
  regNumberScore: string | null;
  verificationConditionsSeverity: string;
  verificationConditionsCode: string;
  verificationConditionsDesc: string;
  totalGrantApproved: number;
  remainingParticipantGrant: number;
  isNonFunded: boolean;
}

export type PartnerBankDetails = Pick<
  Partner,
  | "id"
  | "sortCode"
  | "accountNumber"
  | "firstName"
  | "lastName"
  | "accountStreet"
  | "accountBuilding"
  | "accountLocality"
  | "accountPostcode"
  | "accountTownOrCity"
  | "accountId"
  | "companyNumber"
>;
