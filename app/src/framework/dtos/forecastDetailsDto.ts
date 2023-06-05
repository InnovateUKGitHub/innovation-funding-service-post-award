export interface ForecastDetailsDTO {
  costCategoryId: string;
  id: string;
  periodEnd: Date | null;
  periodId: PeriodId;
  periodStart: Date | null;
  value: number;
}
