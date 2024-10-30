import { LoanStatus } from "@framework/entities/loan-status";

export interface LoanDto {
  amount: number;
  comments: string;
  forecastAmount: number;
  id: LoanId;
  period: PeriodId;
  requestDate: Date | null;
  status: LoanStatus;

  // Note: Pulled from project table
  totals?: {
    remainingLoan: number;
    totalLoan: number;
    totalPaidToDate: number;
  };
}
