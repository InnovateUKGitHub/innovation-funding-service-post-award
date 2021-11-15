import { LoanDto, LoanDtoWithTotals } from "@framework/dtos/loanDto";
import { roundCurrency } from "@framework/util";

import { ISalesforceLoan, ISalesforceLoanWithTotals } from "../loanRepository";
import { SalesforceBaseMapper } from "./saleforceMapperBase";

export class LoanMapper extends SalesforceBaseMapper<ISalesforceLoan, LoanDto> {
  constructor() {
    super();
  }

  public map(item: ISalesforceLoan): LoanDto {
    const requestDate = this.clock.parseRequiredSalesforceDateTime(item.Loan_PlannedDateForDrawdown__c);
    const comments = item.Loan_UserComments__c || "";

    return {
      id: item.Id,
      status: item.Loan_DrawdownStatus__c,
      period: item.Acc_PeriodNumber__c,
      requestDate,
      amount: item.Loan_LatestForecastDrawdown__c,
      comments,
    };
  }

  public mapWithTotals(item: ISalesforceLoanWithTotals): LoanDtoWithTotals {
    const loanDetails = this.map(item.Pre_Payments__r.records[0]);

    const totalLoan = item.Acc_TotalParticipantCosts__c;
    const totalPaidToDate = item.Acc_TotalGrantApproved__c;
    const remainingLoan = roundCurrency(totalLoan - totalPaidToDate);

    return {
      ...loanDetails,
      totalLoan,
      totalPaidToDate,
      remainingLoan,
    };
  }
}
