import { LoanDto } from "@framework/dtos/loanDto";
import { LoanStatus } from "@framework/entities/loan-status";
import { Clock } from "@framework/util/clock";
import { roundCurrency } from "@framework/util/numberHelper";

const clock = new Clock();

const loanStatusFromSfMap = (fieldValue: string): LoanStatus => {
  const loanFromSfStatusMap = {
    Planned: LoanStatus.PLANNED,
    Requested: LoanStatus.REQUESTED,
    Approved: LoanStatus.APPROVED,
  };
  const statusValueMatch = loanFromSfStatusMap[fieldValue as keyof typeof loanFromSfStatusMap];

  return statusValueMatch || LoanStatus.UNKNOWN;
};

type LoanNode = GQL.PartialNode<{
  Id: string;
  Acc_PeriodNumber__c: GQL.Value<number>;
  Acc_GranttobePaid__c: GQL.Value<number>;
  Loan_DrawdownStatus__c: GQL.Value<string>;
  Loan_LatestForecastDrawdown__c: GQL.Value<number>;
  Loan_UserComments__c: GQL.Value<string>;
  Loan_PlannedDateForDrawdown__c: GQL.Value<string>;
  Acc_ProjectParticipant__r: GQL.Maybe<{
    Acc_TotalParticipantCosts__c: GQL.Value<number>;
    Acc_TotalGrantApproved__c: GQL.Value<number>;
  }>;
}>;

// removes undefined as option for totals derived from the LoanDto
type LoanDtoMapping = Pick<
  Omit<LoanDto, "totals"> & {
    totals: {
      remainingLoan: number;
      totalLoan: number;
      totalPaidToDate: number;
    };
  },
  "id" | "period" | "status" | "forecastAmount" | "comments" | "requestDate" | "amount" | "totals"
>;

const mapper: GQL.DtoMapper<LoanDtoMapping, LoanNode> = {
  id(node) {
    return (node?.Id ?? "") as LoanId;
  },
  amount(node) {
    return node?.Acc_GranttobePaid__c?.value ?? 0;
  },
  period(node) {
    return (node?.Acc_PeriodNumber__c?.value ?? 0) as PeriodId;
  },
  status(node) {
    return loanStatusFromSfMap(node?.Loan_DrawdownStatus__c?.value ?? "unknown");
  },
  forecastAmount(node) {
    return node?.Loan_LatestForecastDrawdown__c?.value ?? 0;
  },
  comments(node) {
    return node?.Loan_UserComments__c?.value ?? "";
  },
  requestDate(node) {
    return clock.parseOptionalSalesforceDateTime(node?.Loan_PlannedDateForDrawdown__c?.value ?? "");
  },
  totals(node) {
    const totalLoan = node?.Acc_ProjectParticipant__r?.Acc_TotalParticipantCosts__c?.value ?? 0;
    const totalPaidToDate = node?.Acc_ProjectParticipant__r?.Acc_TotalGrantApproved__c?.value ?? 0;
    const forecastAmount = node?.Loan_LatestForecastDrawdown__c?.value ?? 0;
    const totalRequestedIncForecast = roundCurrency(forecastAmount + totalPaidToDate);
    const remainingLoan = roundCurrency(totalLoan - totalRequestedIncForecast);
    const expectedTotal = forecastAmount + remainingLoan + totalPaidToDate;

    if (totalLoan !== expectedTotal) throw Error("Loan totals do not match.");

    return {
      totalLoan,
      totalPaidToDate,
      remainingLoan,
    };
  },
};

/**
 * Maps a specified Loan Node from a GQL query to a slice of
 * the LoanDto to ensure consistency and compatibility in the application
 */
export function mapToLoanDto<T extends LoanNode, PickList extends keyof LoanDtoMapping>(
  loanNode: T,
  pickList: PickList[],
): Pick<LoanDtoMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](loanNode);
    return dto;
  }, {} as Pick<LoanDtoMapping, PickList>);
}

/**
 * Maps Loan Edge to array of Loan DTOs.
 */
export function mapToLoanDtoArray<
  T extends ReadonlyArray<GQL.Maybe<{ node: LoanNode }>> | null,
  PickList extends keyof LoanDtoMapping,
>(loanEdges: T, pickList: PickList[]): Pick<LoanDtoMapping, PickList>[] {
  return (
    loanEdges?.map(loanNode => {
      return mapToLoanDto(loanNode?.node ?? null, pickList);
    }) ?? []
  );
}
