export interface LoanDto {
  id: string;
  period: number;
  status: string;
  amount: number;
  requestDate: Date;
  comments: string;
}

export interface LoanDtoWithTotals extends LoanDto {
  totalLoan: number;
  totalPaidToDate: number;
  remainingLoan: number;
}
