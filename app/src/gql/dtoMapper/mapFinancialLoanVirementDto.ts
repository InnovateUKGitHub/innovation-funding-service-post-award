import { LoanFinancialVirement } from "@framework/entities/financialVirement";
import { LoanStatus } from "@framework/entities/loan-status";
import { Clock } from "@framework/util/clock";

const loanStatusFromSfMap = (fieldValue: string): LoanStatus => {
  const loanFromSfStatusMap = {
    Planned: LoanStatus.PLANNED,
    Requested: LoanStatus.REQUESTED,
    Approved: LoanStatus.APPROVED,
  };

  const statusValueMatch = loanFromSfStatusMap[fieldValue as keyof typeof loanFromSfStatusMap];

  return statusValueMatch || LoanStatus.UNKNOWN;
};

export type FinancialLoanVirementNode = GQL.PartialNode<{
  Id: string;
  Loan_PeriodNumber__c: GQL.Value<number>;
  Loan_CurrentDrawdownValue__c: GQL.Value<number>;
  Loan_CurrentDrawdownDate__c: GQL.Value<string>;
  Loan_NewDrawdownValue__c: GQL.Value<number>;
  Loan_NewDrawdownDate__c: GQL.Value<string>;
  Loan_LoanDrawdownRequest__c: GQL.Value<string>;
  Loan_DrawdownStatus__c: GQL.Value<string>;
}>;

const itemMapper: GQL.DtoMapper<LoanFinancialVirement, FinancialLoanVirementNode> = {
  currentDate(node) {
    return !!node?.Loan_CurrentDrawdownDate__c?.value
      ? new Clock().parseRequiredSalesforceDateTime(node?.Loan_CurrentDrawdownDate__c?.value)
      : new Date(NaN);
  },
  currentValue(node) {
    return node?.Loan_CurrentDrawdownValue__c?.value ?? 0;
  },
  id(node) {
    return node?.Id as LoanId;
  },
  isEditable(node) {
    return this.status(node) === LoanStatus.PLANNED;
  },
  period(node) {
    return (node?.Loan_PeriodNumber__c?.value ?? 0) as PeriodId;
  },
  newDate(node) {
    return !!node?.Loan_NewDrawdownDate__c?.value
      ? new Clock().parseRequiredSalesforceDateTime(node?.Loan_NewDrawdownDate__c?.value)
      : new Date(NaN);
  },
  newValue(node) {
    return node?.Loan_NewDrawdownValue__c?.value ?? 0;
  },
  status(node) {
    return loanStatusFromSfMap(node?.Loan_DrawdownStatus__c?.value ?? "unknown");
  },
};

/**
 * maps for a single loan financial virement item
 */
export function mapLoanFinancialVirementDto<
  T extends FinancialLoanVirementNode,
  PickList extends keyof LoanFinancialVirement,
>(node: T, pickList: PickList[]): Pick<LoanFinancialVirement, PickList> {
  return pickList.reduce(
    (dto, field) => {
      dto[field] = itemMapper[field](node);
      return dto;
    },
    {} as Pick<LoanFinancialVirement, PickList>,
  );
}

/**
 * maps for aan array of loan financial virement items
 */
export function mapLoanFinancialVirementDtoArray<
  T extends FinancialLoanVirementNode,
  PickList extends keyof LoanFinancialVirement,
>(loans: ReadonlyArray<Readonly<GQL.Maybe<{ node: T | null }>>>, pickList: PickList[]) {
  if (!loans) return [];
  return loans.map(node => mapLoanFinancialVirementDto(node?.node, pickList));
}
