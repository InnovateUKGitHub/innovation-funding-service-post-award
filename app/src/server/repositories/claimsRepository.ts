import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";
import { ClaimStatus } from "../../types";
import { BadRequestError } from "../features/common/appError";

export interface ISalesforceClaim {
  Id: string;
  Acc_ProjectParticipant__r: {
    Id: string;
    Acc_ProjectRole__c: string;
    Acc_AccountId__r: {
      Name: string;
    }
  };
  LastModifiedDate: string;
  Acc_ClaimStatus__c: ClaimStatus;
  Acc_ProjectPeriodStartDate__c: string;
  Acc_ProjectPeriodEndDate__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectPeriodCost__c: number;
  Acc_TotalCostsApproved__c: number;
  Acc_TotalCostsSubmitted__c: number;
  Acc_TotalGrantApproved__c: number;
  Acc_ApprovedDate__c: string | null;
  Acc_PaidDate__c: string | null;
  Acc_LineItemDescription__c: string | null;
  Acc_IARRequired__c: boolean;
}

export interface IClaimRepository {
  getAllByProjectId(projectId: string): Promise<ISalesforceClaim[]>;
  getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]>;
  get(partnerId: string, periodId: number): Promise<ISalesforceClaim>;
  update(updatedClaim: Partial<ISalesforceClaim> & { Id: string }): Promise<boolean>;
}

export class ClaimRepository extends SalesforceRepositoryBase<ISalesforceClaim> implements IClaimRepository {

  private readonly recordType = "Total Project Period";

  protected readonly salesforceObjectName = "Acc_Claims__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_ProjectParticipant__r.Id",
    "Acc_ProjectParticipant__r.Acc_ProjectRole__c",
    "Acc_ProjectParticipant__r.Acc_AccountId__r.Name",
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

  public getAllByProjectId(projectId: string): Promise<ISalesforceClaim[]> {
    const filter = `
      Acc_ProjectParticipant__r.Acc_ProjectId__c = '${projectId}'
      AND RecordType.Name = '${this.recordType}'
      AND Acc_ClaimStatus__c != 'New'
    `;
    return super.where(filter);
  }

  public getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]> {
    const filter = `
      Acc_ProjectParticipant__c = '${partnerId}'
      AND RecordType.Name = '${this.recordType}'
      AND Acc_ClaimStatus__c != 'New'
    `;
    return super.where(filter);
  }

  public async get(partnerId: string, periodId: number) {
    const filter = `
      Acc_ProjectParticipant__c = '${partnerId}'
      AND Acc_ProjectPeriodNumber__c = ${periodId}
      AND RecordType.Name = '${this.recordType}'
      AND Acc_ClaimStatus__c != 'New'
    `;
    const claim = await super.where(filter);
    if (claim.length === 0) {
      throw new BadRequestError("Claim does not exist");
    }
    return claim[0];
  }

  public update(updatedClaim: Updatable<ISalesforceClaim>) {
    return super.updateItem(updatedClaim);
  }
}
