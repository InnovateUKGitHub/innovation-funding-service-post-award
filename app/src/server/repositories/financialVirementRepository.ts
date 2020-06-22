import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";
import { PartnerFinancialVirement } from "@framework/entities";
import { SalesforceFinancialVirementMapper } from "./mappers/financialVirementMapper";
import { Connection } from "jsforce";
import { ILogger } from "@server/features/common/logger";

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
  Acc_CurrentAwardRate__c: number;
  Acc_NewAwardRate__c: number;
  Acc_NewRemainingGrant__c: number;
  Acc_NewTotalEligibleCosts__c: number;
  RecordTypeId: string;
}

export interface IFinancialVirementRepository {
  getAllForPcr(pcrItemId: string): Promise<PartnerFinancialVirement[]>;
  updateVirements(items: Updatable<ISalesforceFinancialVirement>[]): Promise<boolean>;
}

export class FinancialVirementRepository extends SalesforceRepositoryBase<ISalesforceFinancialVirement> implements IFinancialVirementRepository {
  constructor(private getRecordTypeId: (objectName: string, recordType: string) => Promise<string>, getSalesforceConnection: () => Promise<Connection>, logger: ILogger) {
    super(getSalesforceConnection, logger);
  }

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
    "Acc_CurrentAwardRate__c",
    "Acc_NewAwardRate__c",
    "Acc_NewRemainingGrant__c",
    "Acc_NewTotalEligibleCosts__c",
    "RecordTypeId",
  ];

  public async getAllForPcr(pcrItemId: string): Promise<PartnerFinancialVirement[]> {
    const partnerVirementRecordType = await this.getRecordTypeId(this.salesforceObjectName, "Virements for Participant");
    const costCategoryVirementRecordType = await this.getRecordTypeId(this.salesforceObjectName, "Virements for Costs");
    const data = await super.where(`Acc_ProjectChangeRequest__c = '${pcrItemId}' or Acc_ParticipantVirement__r.Acc_ProjectChangeRequest__c = '${pcrItemId}'`);
    return new SalesforceFinancialVirementMapper(partnerVirementRecordType, costCategoryVirementRecordType).map(data);
  }

  public updateVirements(items: Updatable<ISalesforceFinancialVirement>[]) {
    return super.updateAll(items);
  }
}
