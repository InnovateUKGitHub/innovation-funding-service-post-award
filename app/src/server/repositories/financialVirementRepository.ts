import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";

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
  insertVirements(items: Partial<ISalesforceFinancialVirement>[]): Promise<string[]>;
  updateVirements(items: Updatable<ISalesforceFinancialVirement>[]): Promise<boolean>;
  deleteVirements(ids: string[]): Promise<void>;
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

  public getAllForPcr(pcrItemId: string): Promise<ISalesforceFinancialVirement[]> {
    return super.where({ Acc_ProjectChangeRequest__c: pcrItemId });
  }

  public updateVirements(items: Updatable<ISalesforceFinancialVirement>[]) {
    return super.updateAll(items);
  }

  public insertVirements(items: Partial<ISalesforceFinancialVirement>[]) {
    return super.insertAll(items);
  }

  public deleteVirements(ids: string[]) {
    return super.deleteAll(ids);
  }
}
