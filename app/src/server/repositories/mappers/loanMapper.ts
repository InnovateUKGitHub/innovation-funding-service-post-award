import { LoanDto, LoanDtoWithTotals } from "@framework/dtos/loanDto";
import { LoanStatus } from "@framework/entities";
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
      status: LoanMapper.loanStatusFromSfMap(item.Loan_DrawdownStatus__c),
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

  static loanStatusToSfMap(status: LoanStatus): string {
    if (status === LoanStatus.UNKNOWN) {
      throw Error("You can't update with an invalid status");
    }

    const loanToSfStatusMap = {
      [LoanStatus.PLANNED]: "Planned",
      [LoanStatus.REQUESTED]: "Requested",
      [LoanStatus.APPROVED]: "Approved",
    };

    return loanToSfStatusMap[status];
  }

  static loanStatusFromSfMap(fieldValue: string): LoanStatus {
    const loanFromSfStatusMap = {
      Planned: LoanStatus.PLANNED,
      Requested: LoanStatus.REQUESTED,
      Approved: LoanStatus.APPROVED,
    };

    const statusValueMatch = loanFromSfStatusMap[fieldValue as keyof typeof loanFromSfStatusMap];

    return statusValueMatch || LoanStatus.UNKNOWN;
  }
}
