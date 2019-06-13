import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceClaimStatusChange {
  Id: string;
  Acc_Claim__c: string;
  Acc_PreviousClaimStatus__c: string;
  Acc_NewClaimStatus__c: string;
  Acc_ExternalComment__c: string | null;
  Acc_ParticipantVisibility__c: boolean;
  CreatedBy: {
    CommunityNickname: string;
  };
  CreatedDate: string;
}

export interface IClaimStatusChangeRepository {
  getAllForClaim(partnerId: string, periodId: number): Promise<ISalesforceClaimStatusChange[]>;
  create(item: Partial<ISalesforceClaimStatusChange>): Promise<string>;
}

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
    "CreatedBy.CommunityNickname",
    "CreatedDate",
  ];

  create(item: Partial<ISalesforceClaimStatusChange>) {
    return super.insertItem(item);
  }

  getAllForClaim(partnerId: string, periodId: number): Promise<ISalesforceClaimStatusChange[]> {
    return super.where(`Acc_Claim__r.Acc_ProjectParticipant__c = '${partnerId}' and Acc_Claim__r.Acc_ProjectPeriodNumber__c = ${periodId}`);
  }

}
