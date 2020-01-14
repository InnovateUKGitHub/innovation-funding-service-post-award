import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceClaimStatusChange {
  Id: string;
  Acc_Claim__c: string;
  Acc_PreviousClaimStatus__c: string;
  Acc_NewClaimStatus__c: string;
  Acc_ExternalComment__c: string | null;
  Acc_ParticipantVisibility__c: boolean;
  CreatedDate: string;
}

export interface IClaimStatusChangeRepository {
  getAllForClaim(partnerId: string, periodId: number): Promise<ISalesforceClaimStatusChange[]>;
  create(item: Partial<ISalesforceClaimStatusChange>): Promise<string>;
}

/** 
 * ClaimStatusChanges are stored in the Acc_StatusChange__c
 * 
 * Hold all status changes for Claims level records ("Acc_Claims__c" of type "Total Project Period")
 * 
 * Acc_ParticipantVisibility__c is a flag determining whether to show message to pm or fc.
 * */
export class ClaimStatusChangeRepository
  extends SalesforceRepositoryBase<ISalesforceClaimStatusChange>
  implements IClaimStatusChangeRepository {

  protected readonly salesforceObjectName = "Acc_StatusChange__c";
  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_Claim__c",
    "Acc_PreviousClaimStatus__c",
    "Acc_NewClaimStatus__c",
    "Acc_ExternalComment__c",
    "Acc_ParticipantVisibility__c",
    "CreatedDate",
  ];

  create(item: Partial<ISalesforceClaimStatusChange>) {
    return super.insertItem(item);
  }

  getAllForClaim(partnerId: string, periodId: number): Promise<ISalesforceClaimStatusChange[]> {
    return super.where(`Acc_Claim__r.Acc_ProjectParticipant__c = '${partnerId}' and Acc_Claim__r.Acc_ProjectPeriodNumber__c = ${periodId}`);
  }

}
