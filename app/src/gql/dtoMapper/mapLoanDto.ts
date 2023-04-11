import type { LoanDto } from "@framework/dtos";
import { LoanStatus } from "@framework/entities";
import { Clock } from "@framework/util";

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

type LoanNode = Readonly<
  Partial<{
    Id: string;
    Acc_PeriodNumber__c: GQL.Value<number>;
    Loan_DrawdownStatus__c: GQL.Value<string>;
    Loan_LatestForecastDrawdown__c: GQL.Value<number>;
    Loan_UserComments__c: GQL.Value<string>;
    Loan_PlannedDateForDrawdown__c: GQL.Value<string>;
  }>
> | null;

type LoanDtoMapping = Pick<LoanDto, "id" | "period" | "status" | "forecastAmount" | "comments" | "requestDate">;

const mapper: GQL.DtoMapper<LoanDtoMapping, LoanNode> = {
  id(node) {
    return (node?.Id ?? "") as LoanId;
  },
  period(node) {
    return node?.Acc_PeriodNumber__c?.value ?? 0;
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
  T extends ReadonlyArray<{ node: LoanNode } | null> | null,
  PickList extends keyof LoanDtoMapping,
>(loanEdges: T, pickList: PickList[]): Pick<LoanDtoMapping, PickList>[] {
  return (
    loanEdges?.map(loanNode => {
      return mapToLoanDto(loanNode?.node ?? null, pickList);
    }) ?? []
  );
}
