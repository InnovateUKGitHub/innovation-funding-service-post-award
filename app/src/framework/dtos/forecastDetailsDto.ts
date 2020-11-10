export interface ForecastDetailsDTO {
  id: string;
  costCategoryId: string;
  periodId: number;
  periodStart: Date|null;
  periodEnd: Date|null;
  value: number;
}
