export interface CostsSummaryForPeriodDto {
    costCategoryId: string;
    offerTotal: number;
    forecastThisPeriod: number;
    costsClaimedToDate: number;
    costsClaimedThisPeriod: number;
    remainingOfferCosts: number;
}
