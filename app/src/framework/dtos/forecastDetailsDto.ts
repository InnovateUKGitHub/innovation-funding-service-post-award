export interface ForecastDetailsDTO {
  costCategoryId: CostCategoryId;
  id: string;
  periodEnd: Date | null;
  periodId: PeriodId;
  periodStart: Date | null;
  value: number;
}
