import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";
import { PartnerFinancialVirement } from "@framework/entities";
import { SalesforceFinancialVirementMapper } from "./mappers/financialVirementMapper";

export interface ISalesforceFinancialVirement {
  Id: string;
  Acc_ProjectChangeRequest__c: string;
  Acc_Profile__c: string;
  Acc_Profile__r: {
    Acc_CostCategory__c: string;
    Acc_ProjectParticipant__c: string;
  };
  Acc_ProjectParticipant__c: string;
  Acc_ClaimedCostsToDate__c: number;
  Acc_CurrentCosts__c: number;
  Acc_NewCosts__c: number;
}

export interface IFinancialVirementRepository {
  getAllForPcr(pcrItemId: string): Promise<PartnerFinancialVirement[]>;
  updateVirements(items: Updatable<ISalesforceFinancialVirement>[]): Promise<boolean>;
}

export class FinancialVirementRepository extends SalesforceRepositoryBase<ISalesforceFinancialVirement> implements IFinancialVirementRepository {

  protected readonly salesforceObjectName = "Acc_Virements__c";
  protected salesforceFieldNames = [
    "Id",
    "Acc_ProjectChangeRequest__c",
    "Acc_Profile__c",
    "Acc_Profile__r.Acc_CostCategory__c",
    "Acc_Profile__r.Acc_ProjectParticipant__c",
    "Acc_ProjectParticipant__c",
    "Acc_ClaimedCostsToDate__c",
    "Acc_CurrentCosts__c",
    "Acc_NewCosts__c",
  ];

  public async getAllForPcr(pcrItemId: string): Promise<PartnerFinancialVirement[]> {
    const data = await super.where(`Acc_ProjectChangeRequest__c = '${pcrItemId}' or Acc_ParticipantVirement__r.Acc_ProjectChangeRequest__c = '${pcrItemId}'`);
    return new SalesforceFinancialVirementMapper().map(data);
  }

  public updateVirements(items: Updatable<ISalesforceFinancialVirement>[]) {
    return super.updateAll(items);
  }
}
