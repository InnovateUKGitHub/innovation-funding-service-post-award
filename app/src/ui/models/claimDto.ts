export interface ClaimDto {
  id: string;
  partnerId: string;
  lastModifiedDate: Date;
  status: string;
  periodStartDate: Date;
  periodEndDate: Date;
  periodId: number;
  totalCost: number;
  forecastCost: number;
  approvedDate: Date|null;
  paidDate: Date|null;
}
