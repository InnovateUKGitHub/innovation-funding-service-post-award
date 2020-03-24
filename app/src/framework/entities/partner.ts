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
}
