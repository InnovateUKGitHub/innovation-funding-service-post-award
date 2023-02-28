import { LoanDto } from "@framework/dtos/loanDto";
import { sss } from "@server/util/salesforce-string-helpers";
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

  // Project table fields
  Acc_TotalParticipantCosts__c: number;
  Acc_TotalGrantApproved__c: number;
  Pre_Payments__r: {
    totalSize: number;
    done: boolean;
    records: ISalesforceLoan[];
  } | null;
}

export class LoanRepository extends SalesforceRepositoryBaseWithMapping<ISalesforceLoan, LoanDto> {
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

  protected mapper = new LoanMapper();

  public async update(loanToUpdate: Updatable<ISalesforceLoan>): Promise<boolean> {
    return super.updateItem(loanToUpdate);
  }

  public async getAll(projectId: ProjectId): Promise<LoanDto[]> {
    const projectWhereQuery = `Acc_ProjectParticipant__r.Acc_ProjectId__c = '${sss(
      projectId,
    )}' ORDER BY Acc_PeriodNumber__c ASC`;

    return super.where(projectWhereQuery);
  }

  public async get(projectId: ProjectId, options: { loanId?: string; periodId?: number }): Promise<LoanDto> {
    let whereClause = "";

    if (options.periodId) whereClause = `WHERE Acc_PeriodNumber__c = ${sss(options.periodId)}`;
    if (options.loanId) whereClause = `WHERE Id = '${sss(options.loanId)}'`;

    const query = this.getLoanQuery(projectId, whereClause);
    const [loanItem] = await super.query<ISalesforceLoan[]>(query);

    return new LoanMapper().mapWithTotals(loanItem);
  }

  public getLoanQuery(projectId: ProjectId, whereClause: string): string {
    const sqlLoanColumns = this.salesforceFieldNames.map(sss).join(", ");
    const subRequest = `SELECT ${sqlLoanColumns} FROM ${sss(this.salesforcePrePaymentTable)} ${whereClause}`;
    const totalCostColumns = `Id, Acc_TotalParticipantCosts__c, Acc_TotalGrantApproved__c, (${subRequest})`;

    return `SELECT ${totalCostColumns} FROM Acc_ProjectParticipant__c WHERE Acc_ProjectId__c = '${sss(projectId)}'`;
  }
}

export type ILoanRepository = Pick<LoanRepository, "getAll" | "get" | "update">;
