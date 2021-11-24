import { LoanStatus } from "@framework/entities";

export interface LoanDto {
  id: string;
  period: number;
  status: LoanStatus;
  amount: number;
  requestDate: Date;
  comments: string;
}

export interface LoanDtoWithTotals extends LoanDto {
  totalLoan: number;
  totalPaidToDate: number;
  remainingLoan: number;
}
