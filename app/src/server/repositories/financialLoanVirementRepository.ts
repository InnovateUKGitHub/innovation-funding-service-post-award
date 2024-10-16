import { ILogger } from "@shared/logger";
import { sss } from "@server/util/salesforce-string-helpers";
import { SalesforceFinancialLoanVirementMapper } from "./mappers/financialLoanVirementMapper";
import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";
import { LoanFinancialVirement } from "@framework/entities/financialVirement";
import { BadRequestError } from "@shared/appError";
import { TsforceConnection } from "@server/tsforce/TsforceConnection";

export interface ISalesforceFinancialLoanVirement {
  Id: string;
  Acc_ProjectChangeRequest__c: string;
  RecordTypeId: string;

  // Loan Virement Details
  Loan_PeriodNumber__c: number;
  Loan_CurrentDrawdownValue__c: number;
  Loan_CurrentDrawdownDate__c: string;
  Loan_NewDrawdownValue__c: number;
  Loan_NewDrawdownDate__c: string;
  Loan_LoanDrawdownRequest__c: string;
  Loan_DrawdownStatus__c: string;
}

export class FinancialLoanVirementRepository extends SalesforceRepositoryBase<ISalesforceFinancialLoanVirement> {
  constructor(
    private readonly getRecordTypeId: (objectName: string, recordType: string) => Promise<string>,
    getSalesforceConnection: () => TsforceConnection,
    logger: ILogger,
  ) {
    super(getSalesforceConnection, logger);
  }

  protected readonly salesforceObjectName = "Acc_Virements__c";
  protected salesforceFieldNames = [
    "Id",
    "Acc_ProjectChangeRequest__c",
    "RecordTypeId",
    "Loan_PeriodNumber__c",
    "Loan_CurrentDrawdownValue__c",
    "Loan_CurrentDrawdownDate__c",
    "Loan_NewDrawdownValue__c",
    "Loan_NewDrawdownDate__c",
    "Loan_LoanDrawdownRequest__c",
    "Loan_DrawdownStatus__c",
  ];

  public async getForPcr(pcrItemId: PcrItemId): Promise<LoanFinancialVirement[]> {
    const loanVirementRecordType = await this.getRecordTypeId(
      this.salesforceObjectName,
      "Period Virement for Loan Drawdown",
    );

    const virementMapper = new SalesforceFinancialLoanVirementMapper(loanVirementRecordType);

    const virementWhereQuery = `Acc_ProjectChangeRequest__c = '${sss(
      pcrItemId,
    )}' or Acc_ParticipantVirement__r.Acc_ProjectChangeRequest__c = '${sss(
      pcrItemId,
    )}' ORDER BY Loan_PeriodNumber__c ASC`;
    const rawLoans = await super.where(virementWhereQuery);
    if (!rawLoans.length) {
      throw new BadRequestError(`No virement found for '${pcrItemId}'.`);
    }
    return virementMapper.map(rawLoans);
  }

  public updateVirements(items: Updatable<ISalesforceFinancialLoanVirement>[]): Promise<boolean> {
    return super.updateAll(items);
  }
}

export type IFinancialLoanVirementRepository = Pick<FinancialLoanVirementRepository, "getForPcr" | "updateVirements">;
