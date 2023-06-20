import { LoanDto } from "@framework/dtos/loanDto";
import { LoanStatus } from "@framework/entities/loan-status";
import { roundCurrency } from "@framework/util/numberHelper";
import { BadRequestError } from "@shared/appError";
import { ISalesforceLoan } from "../loanRepository";
import { SalesforceBaseMapper } from "./salesforceMapperBase";

export class LoanMapper extends SalesforceBaseMapper<ISalesforceLoan, LoanDto> {
  constructor() {
    super();
  }

  public map(item: ISalesforceLoan): LoanDto {
    const requestDate = this.clock.parseOptionalSalesforceDateTime(item.Loan_PlannedDateForDrawdown__c);
    const comments = item.Loan_UserComments__c || "";

    return {
      id: item.Id as LoanId,
      status: LoanMapper.loanStatusFromSfMap(item.Loan_DrawdownStatus__c),
      period: item.Acc_PeriodNumber__c as PeriodId,
      requestDate,
      amount: item.Acc_GranttobePaid__c,
      forecastAmount: item.Loan_LatestForecastDrawdown__c,
      comments,
    };
  }

  public mapWithTotals(item: ISalesforceLoan): LoanDto {
    const nestedQueryRecord = item?.Pre_Payments__r?.records[0];

    if (!nestedQueryRecord) throw new BadRequestError("No loan found.");

    const loanDetails = this.map(nestedQueryRecord);

    const totalLoan = item.Acc_TotalParticipantCosts__c;
    const totalPaidToDate = item.Acc_TotalGrantApproved__c;

    const totalRequestedIncForecast = roundCurrency(loanDetails.forecastAmount + totalPaidToDate);
    const remainingLoan = roundCurrency(totalLoan - totalRequestedIncForecast);

    const expectedTotal = loanDetails.forecastAmount + remainingLoan + totalPaidToDate;

    if (totalLoan !== expectedTotal) throw Error("Totals do not match.");

    return {
      ...loanDetails,
      totals: {
        totalLoan,
        totalPaidToDate,
        remainingLoan,
      },
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
