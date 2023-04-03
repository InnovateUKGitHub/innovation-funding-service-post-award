export interface CostsSummaryForPeriodDto {
  costCategoryId: string;
  costsClaimedThisPeriod: number;
  costsClaimedToDate: number;
  forecastThisPeriod: number;
  offerTotal: number;
  overrideAwardRate?: number;
  remainingOfferCosts: number;
}
