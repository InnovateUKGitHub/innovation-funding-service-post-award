import { LoanDto, LoanDtoWithTotals } from "@framework/dtos/loanDto";
import { LoanMapper } from "./mappers/loanMapper";
import { SalesforceRepositoryBaseWithMapping, Updatable } from "./salesforceRepositoryBase";

export interface ISalesforceLoan {
  Id: string;
  Acc_PeriodNumber__c: number;
  Loan_DrawdownStatus__c: string;
  Acc_GranttobePaid__c: number;
  Loan_LatestForecastDrawdown__c: number;
  Loan_PlannedDateForDrawdown__c: string;
  Loan_UserComments__c: string | null;
}

export interface ISalesforceLoanWithTotals extends Omit<ISalesforceLoan, "Acc_ProjectId__r"> {
  Id: string;
  Acc_TotalParticipantCosts__c: number;
  Acc_TotalGrantApproved__c: number;
  Pre_Payments__r: {
    totalSize: number;
    done: boolean;
    records: ISalesforceLoan[];
  };
}

export class LoanRepository extends SalesforceRepositoryBaseWithMapping<ISalesforceLoan, LoanDto | LoanDtoWithTotals> {
  protected readonly salesforceObjectName = "Acc_Prepayment__c";
  private readonly salesforcePrePaymentTable = "Pre_Payments__r";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_PeriodNumber__c",
    "Loan_DrawdownStatus__c",
    "Acc_GranttobePaid__c",
    "Loan_LatestForecastDrawdown__c",
    "Loan_PlannedDateForDrawdown__c",
    "Loan_UserComments__c",
    "Acc_ProjectParticipant__r.Id",
  ];

  private totalProjectCostsFields = ["Id", "Acc_TotalParticipantCosts__c", "Acc_TotalGrantApproved__c"];

  protected mapper = new LoanMapper();

  public async update(loanToUpdate: Updatable<ISalesforceLoan>): Promise<boolean> {
    return super.updateItem(loanToUpdate);
  }

  public async getAll(projectId: string): Promise<LoanDto[]> {
    const projectWhereQuery = `Acc_ProjectParticipant__r.Acc_ProjectId__c = '${projectId}'`;

    return super.where(projectWhereQuery);
  }

  public async getWithoutTotals(projectId: string, loanId: string): Promise<LoanDto> {
    const sqlLoanColumns = this.salesforceFieldNames.join(", ");
    const projectWhereQuery = `Acc_ProjectParticipant__r.Acc_ProjectId__c = '${projectId}'`;
    const subRequest = `SELECT ${sqlLoanColumns} FROM ${this.salesforceObjectName} WHERE Id = '${loanId}' and ${projectWhereQuery}`;

    const [loan] = await super.query<ISalesforceLoan[]>(subRequest);

    return new LoanMapper().map(loan);
  }

  public async getWithTotals(projectId: string, loanId: string): Promise<LoanDtoWithTotals> {
    const sqlLoanColumns = this.salesforceFieldNames.join(", ");
    const sqlTotalCostColumns = this.totalProjectCostsFields.join(", ");

    const subRequest = `SELECT ${sqlLoanColumns} FROM ${this.salesforcePrePaymentTable} WHERE Id = '${loanId}'`;
    const totalCostColumns = `${sqlTotalCostColumns}, (${subRequest})`;

    const loanWithTotalsQuery = `SELECT ${totalCostColumns} FROM Acc_ProjectParticipant__c WHERE Acc_ProjectId__c = '${projectId}'`;

    const [loan] = await super.query<ISalesforceLoanWithTotals[]>(loanWithTotalsQuery);

    return new LoanMapper().mapWithTotals(loan);
  }
}

export type ILoanRepository = Pick<LoanRepository, "getAll" | "getWithoutTotals" | "getWithTotals" | "update">;
