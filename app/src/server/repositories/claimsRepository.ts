import { IPicklistEntry } from "@framework/types";
import { NotFoundError } from "../features/common/appError";
import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";

export interface ISalesforceClaim {
  Id: string;
  Acc_ProjectParticipant__r: {
    Id: string;
    Acc_OverheadRate__c: number;
    Acc_ProjectRole__c: string;
    Acc_ProjectId__c: string;
    Acc_AccountId__r: {
      Name: string;
    };
  };
  LastModifiedDate: string;
  Acc_PCF_Status__c: string;
  Acc_IAR_Status__c: string;
  Acc_ClaimStatus__c: string;
  ClaimStatusLabel: string;
  Acc_ProjectPeriodStartDate__c: string;
  Acc_ProjectPeriodEndDate__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectPeriodCost__c: number;
  Acc_TotalCostsApproved__c: number;
  Acc_TotalCostsSubmitted__c: number;
  Acc_TotalDeferredAmount__c: number;
  Acc_PeriodCoststobePaid__c: number;
  Acc_TotalGrantApproved__c: number;
  Acc_ApprovedDate__c: string | null;
  Acc_PaidDate__c: string | null;
  Acc_ReasonForDifference__c: string | null;
  Acc_IARRequired__c: boolean;
  Acc_FinalClaim__c: boolean;
}

export interface IClaimRepository {
  getAllByProjectId(projectId: string): Promise<ISalesforceClaim[]>;
  getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]>;
  getAllIncludingNewByPartnerId(partnerId: string): Promise<ISalesforceClaim[]>;
  get(partnerId: string, periodId: number): Promise<ISalesforceClaim>;
  getByProjectId(projectId: string, partnerId: string, periodId: number): Promise<ISalesforceClaim>;
  getClaimStatuses(): Promise<IPicklistEntry[]>;
  update(updatedClaim: Partial<ISalesforceClaim> & { Id: string }): Promise<boolean>;
}

/**
 * Claims are from the Acc_Claims__c table at the "Total Project Period" level.
 *
 * Claims store the total cost for a given period claim and are calculated by summing the Claim details (ie cost categories) for the period
 *
 * Claims also store the status of the claim ie Approval Paid etc.
 */
export class ClaimRepository extends SalesforceRepositoryBase<ISalesforceClaim> implements IClaimRepository {
  private readonly recordType = "Total Project Period";

  protected readonly salesforceObjectName = "Acc_Claims__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_ProjectParticipant__r.Id",
    "Acc_ProjectParticipant__r.Acc_ProjectId__c",
    "Acc_ProjectParticipant__r.Acc_OverheadRate__c",
    "Acc_ProjectParticipant__r.Acc_ProjectRole__c",
    "Acc_ProjectParticipant__r.Acc_AccountId__r.Name",
    "LastModifiedDate",
    "Acc_PCF_Status__c",
    "Acc_IAR_Status__c",
    "Acc_ClaimStatus__c",
    "toLabel(Acc_ClaimStatus__c) ClaimStatusLabel",
    "Acc_ProjectPeriodStartDate__c",
    "Acc_ProjectPeriodEndDate__c",
    "Acc_ProjectPeriodNumber__c",
    "Acc_ProjectPeriodCost__c",
    "Acc_ApprovedDate__c",
    "Acc_PaidDate__c",
    "Acc_ReasonForDifference__c",
    "Acc_IARRequired__c",
    "Acc_FinalClaim__c",
    "Acc_TotalCostsSubmitted__c",
    "Acc_TotalCostsApproved__c",
    "Acc_TotalDeferredAmount__c",
    "Acc_PeriodCoststobePaid__c",
  ];

  private getStandardFilter() {
    return `
      RecordType.Name = '${this.recordType}'
      AND Acc_ClaimStatus__c != 'New'
      AND Acc_ClaimStatus__c != 'Not used'
    `;
  }

  public getAllByProjectId(projectId: string): Promise<ISalesforceClaim[]> {
    const filter =
      this.getStandardFilter() +
      `
      AND Acc_ProjectParticipant__r.Acc_ProjectId__c = '${projectId}'
    `;

    return super.where(filter);
  }

  public getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]> {
    const filter =
      this.getStandardFilter() +
      `
      AND Acc_ProjectParticipant__c = '${partnerId}'
    `;

    return super.where(filter);
  }

  public getAllIncludingNewByPartnerId(partnerId: string): Promise<ISalesforceClaim[]> {
    const filter = `
      RecordType.Name = '${this.recordType}'
      AND Acc_ClaimStatus__c != 'Not used'
      AND Acc_ProjectParticipant__c = '${partnerId}'
    `;

    return super.where(filter);
  }

  public async get(partnerId: string, periodId: number) {
    const filter =
      this.getStandardFilter() +
      `
      AND Acc_ProjectParticipant__c = '${partnerId}'
      AND Acc_ProjectPeriodNumber__c = ${periodId}
    `;

    const claim = await super.filterOne(filter);

    if (!claim) {
      throw new NotFoundError("Claim does not exist");
    }

    return claim;
  }

  public async getByProjectId(projectId: string, partnerId: string, periodId: number) {
    const filter =
      this.getStandardFilter() +
      `
      AND Acc_ProjectParticipant__r.Acc_ProjectId__c = '${projectId}'
      AND Acc_ProjectParticipant__c = '${partnerId}'
      AND Acc_ProjectPeriodNumber__c = ${periodId}
    `;

    const claim = await super.filterOne(filter);

    if (!claim) {
      throw new NotFoundError("Claim does not exist");
    }

    return claim;
  }

  public update(updatedClaim: Updatable<ISalesforceClaim>) {
    return super.updateItem(updatedClaim);
  }

  public async getClaimStatuses() {
    return super.getPicklist("Acc_ClaimStatus__c");
  }
}
