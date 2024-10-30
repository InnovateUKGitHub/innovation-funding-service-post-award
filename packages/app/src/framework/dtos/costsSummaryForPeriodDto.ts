export interface CostsSummaryForPeriodDto {
  costCategoryId: CostCategoryId;
  costsClaimedThisPeriod: number;
  costsClaimedToDate: number;
  forecastThisPeriod: number;
  offerTotal: number;
  overrideAwardRate?: number;
  remainingOfferCosts: number;
}
