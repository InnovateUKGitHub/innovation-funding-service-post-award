import { LoanStatus } from "@framework/entities";

export interface LoanDto {
  amount: number;
  comments: string;
  forecastAmount: number;
  id: LoanId;
  period: number;
  requestDate: Date | null;
  status: LoanStatus;

  // Note: Pulled from project table
  totals?: {
    remainingLoan: number;
    totalLoan: number;
    totalPaidToDate: number;
  };
}
