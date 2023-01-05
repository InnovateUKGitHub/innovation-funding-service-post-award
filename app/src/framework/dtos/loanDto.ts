import { LoanStatus } from "@framework/entities";

export interface LoanDto {
  id: string;
  period: number;
  status: LoanStatus;
  amount: number;
  forecastAmount: number;
  requestDate: Date | null;
  comments: string;

  // Note: Pulled from project table
  totals?: {
    totalLoan: number;
    totalPaidToDate: number;
    remainingLoan: number;
  };
}
