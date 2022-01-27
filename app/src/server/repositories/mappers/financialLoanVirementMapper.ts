import { LoanFinancialVirement } from "@framework/entities";
import { LoanStatus } from "@framework/entities";
import { ISalesforceFinancialLoanVirement } from "../financialLoanVirementRepository";
import { LoanMapper } from "./loanMapper";
import { SalesforceBaseMapper } from "./saleforceMapperBase";

export class SalesforceFinancialLoanVirementMapper extends SalesforceBaseMapper<
  ISalesforceFinancialLoanVirement[],
  LoanFinancialVirement[]
> {
  constructor(private readonly costCategoryLevelRecordType: string) {
    super();
  }

  public map(items: ISalesforceFinancialLoanVirement[]): LoanFinancialVirement[] {
    const virementsWithoutParent = items.filter(x => x.RecordTypeId === this.costCategoryLevelRecordType);

    return virementsWithoutParent.map(x => this.mapLoan(x));
  }

  private mapLoan(item: ISalesforceFinancialLoanVirement): LoanFinancialVirement {
    const status = LoanMapper.loanStatusFromSfMap(item.Loan_DrawdownStatus__c);
    const isEditable = status === LoanStatus.PLANNED;

    return {
      id: item.Id,
      isEditable,
      period: item.Loan_PeriodNumber__c,
      status,
      currentDate: this.clock.parseRequiredSalesforceDateTime(item.Loan_CurrentDrawdownDate__c),
      currentValue: item.Loan_CurrentDrawdownValue__c,
      newDate: this.clock.parseRequiredSalesforceDateTime(item.Loan_NewDrawdownDate__c),
      newValue: item.Loan_NewDrawdownValue__c,
    };
  }
}
