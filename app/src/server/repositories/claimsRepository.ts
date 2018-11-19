import SalesforceBase, { Updatable } from "./salesforceBase";
import { Connection } from "jsforce";
import { ApiError, StatusCode } from "../apis/ApiError";
import { ClaimStatus } from "../../types";

export interface ISalesforceClaim {
  Id: string;
  Acc_ProjectParticipant__c: string;
  LastModifiedDate: string;
  Acc_ClaimStatus__c: ClaimStatus;
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
  Acc_IARRequired__c: boolean;
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
  "Acc_LineItemDescription__c",
  "Acc_IARRequired__c"
];

export interface IClaimRepository {
  getAllByProjectId(projectId: string): Promise<ISalesforceClaim[]>;
  getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]>;
  get(partnerId: string, periodId: number): Promise<ISalesforceClaim>;
  update(updatedClaim: Partial<ISalesforceClaim> & { Id: string }): Promise<boolean>;
}

export class ClaimRepository extends SalesforceBase<ISalesforceClaim> implements IClaimRepository {
  private recordType = "Total Project Period";
  constructor(connection: () => Promise<Connection>) {
    super(connection, "Acc_Claims__c", fields);
  }

  public async getAllByProjectId(projectId: string): Promise<ISalesforceClaim[]> {
    const filter = `Acc_ProjectParticipant__r.Acc_ProjectId__c = '${projectId}' AND RecordType.Name = '${this.recordType}'`;
    return await super.where(filter);
  }

  public async getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}'`;
    return await super.where(filter);
  }

  public async get(partnerId: string, periodId: number) {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND Acc_ProjectPeriodNumber__c = ${periodId} AND RecordType.Name = '${this.recordType}'`;
    const claim = await super.where(filter);
    if (claim.length === 0) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Claim does not exist");
    }
    return claim[0];
  }

  public update(updatedClaim: Updatable<ISalesforceClaim>) {
    return super.update(updatedClaim);
  }
}
