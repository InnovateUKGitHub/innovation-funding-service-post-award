import SalesforceBase, {Updatable} from "./salesforceBase";

export interface ISalesforceClaim {
  Id: string;
  Acc_ProjectParticipant__c: string;
  LastModifiedDate: string;
  Acc_ClaimStatus__c:  "New" | "Draft" | "Submitted" | "MO Queried" | "Awaiting IUK Approval" | "Innovate Queried" | "Approved" | "Paid";
  Acc_ProjectPeriodStartDate__c: string;
  Acc_ProjectPeriodEndDate__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectPeriodCost__c: number;
  Acc_TotalCostsApproved__c: number;
  Acc_TotalCostsSubmitted__c: number;
  Acc_TotalGrantApproved__c: number;
  // TODO get real field names when available
  Acc_ApprovedDate__c: string | null;
  Acc_PaidDate__c: string | null;
  Acc_LineItemDescription__c: string | null;
}

const fields = [
  "Id",
  "Acc_ProjectParticipant__c",
  "LastModifiedDate",
  "Acc_ClaimStatus__c",
  "Acc_ProjectPeriodStartDate__c",
  "Acc_ProjectPeriodEndDate__c",
  "Acc_ProjectPeriodNumber__c",
  "Acc_ProjectPeriodCost__c",
  "Acc_ApprovedDate__c",
  "Acc_PaidDate__c",
  "Acc_LineItemDescription__c"
];

export interface IClaimRepository {
  getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]>;
  get(partnerId: string, periodId: number): Promise<ISalesforceClaim | null>;
  update(updatedClaim: Partial<ISalesforceClaim> & { Id: string }): Promise<boolean>;
}

export class ClaimRepository extends SalesforceBase<ISalesforceClaim> implements IClaimRepository {
  private recordType = "Total Project Period";
  constructor() {
    super("Acc_Claims__c", fields);
  }

  public async getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}'`;
    return await super.whereString(filter);
  }

  public async get(partnerId: string, periodId: number) {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND Acc_ProjectPeriodNumber__c = ${periodId} AND RecordType.Name = '${this.recordType}'`;
    return await super.whereString(filter).then(x => x[0]);
  }

  public update(updatedClaim: Updatable<ISalesforceClaim>) {
    return super.update(updatedClaim);
  }
}
