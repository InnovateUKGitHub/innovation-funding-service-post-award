import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceFinancialVirement {
  Id: string;
  Acc_PcrRecordId__c: string;
  Acc_ProjectChangeRequest__c: string;
  Acc_Profile__c: string;
  Acc_Profile__r: {
    Acc_CostCategory__c: string;
    Acc_ProjectParticipant__c: string;
  };
  Acc_ParticipantName__c: string;
  Acc_NewCosts__c: number;
  Acc_CurrentCosts__c: number;
  Acc_NewAwardRate__c: number;
  Acc_CurrentAwardRate__c: number;
}

export interface IFinancialVirementRepository {
  getAllForPcr(pcrItemId: string): Promise<ISalesforceFinancialVirement[]>;
}

export class FinancialVirementRepository extends SalesforceRepositoryBase<ISalesforceFinancialVirement> implements IFinancialVirementRepository {
  protected readonly salesforceObjectName = "Acc_Virements__c";
  protected salesforceFieldNames = [
    "Id",
    "Acc_PcrRecordId__c",
    "Acc_ProjectChangeRequest__c",
    "Acc_Profile__c",
    "Acc_Profile__r.Acc_CostCategory__c",
    "Acc_Profile__r.Acc_ProjectParticipant__c",
    "Acc_ParticipantName__c",
    "Acc_NewCosts__c",
    "Acc_CurrentCosts__c",
    "Acc_NewAwardRate__c	",
    "Acc_CurrentAwardRate__c",
  ];

  getAllForPcr(pcrItemId: string): Promise<ISalesforceFinancialVirement[]> {
    return super.where({ Acc_ProjectChangeRequest__c: pcrItemId });
  }
}
