export interface ForecastDetailsDTO {
  costCategoryId: string;
  periodId: number;
  periodStart: Date|null;
  periodEnd: Date|null;
  value: number;
}
