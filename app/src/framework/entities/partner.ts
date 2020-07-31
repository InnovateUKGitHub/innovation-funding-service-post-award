export interface Partner {
  id: string;
  accountId: string;
  name: string;
  organisationType: string;
  participantType: string;
  participantSize: string;
  projectRole: string;
  projectRoleName: string;
  projectId: string;
  competitionType: string;
  totalParticipantCosts: number;
  totalApprovedCosts: number;
  capLimit: number;
  awardRate: number;
  totalPaidCosts: number;
  totalFutureForecastsForParticipant: number;
  forecastLastModifiedDate: Date | null;
  claimsForReview: number;
  claimsOverdue: number;
  claimsUnderQuery: number;
  trackingClaims: string;
  overheadRate: number;
  participantStatus: string;
  totalCostsSubmitted: number;
  totalCostsAwarded: number;
  auditReportFrequency: string;
  auditReportFrequencyName: string;
  totalPrepayment: number;
  postcode: string;
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
  validationConditionsCode: number;
  validationConditionsDesc: string;
  personalDetailsScore: number | null;
  addressScore: number | null;
  companyNameScore: number | null;
  regNumberIsValid: boolean | null;
}
