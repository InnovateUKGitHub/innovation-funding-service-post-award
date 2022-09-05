import { PartnerFinancialVirement } from "@framework/entities";
import { ILogger } from "@server/features/common/logger";
import { sss } from "@server/util/salesforce-string-helpers";
import { Connection } from "jsforce";
import { SalesforceFinancialVirementMapper } from "./mappers/financialVirementMapper";
import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";

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

export class FinancialVirementRepository extends SalesforceRepositoryBase<ISalesforceFinancialVirement> {
  constructor(
    private readonly getRecordTypeId: (objectName: string, recordType: string) => Promise<string>,
    getSalesforceConnection: () => Promise<Connection>,
    logger: ILogger,
  ) {
    super(getSalesforceConnection, logger);
  }

  private virementWhereQuery = (id: string) =>
    `Acc_ProjectChangeRequest__c = '${sss(id)}' or Acc_ParticipantVirement__r.Acc_ProjectChangeRequest__c = '${sss(id)}'`;

  protected readonly salesforceObjectName = "Acc_Virements__c";
  protected salesforceFieldNames = [
    "Id",
    "Acc_ProjectChangeRequest__c",

    // Partner Virement
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
    const partnerVirementRecordType = await this.getRecordTypeId(
      this.salesforceObjectName,
      "Virements for Participant",
    );
    const costCategoryVirementRecordType = await this.getRecordTypeId(this.salesforceObjectName, "Virements for Costs");

    const partnerVirementMapper = new SalesforceFinancialVirementMapper(
      partnerVirementRecordType,
      costCategoryVirementRecordType,
    );

    const data = await super.where(this.virementWhereQuery(pcrItemId));
    return partnerVirementMapper.map(data);
  }

  public updateVirements(items: Updatable<ISalesforceFinancialVirement>[]): Promise<boolean> {
    return super.updateAll(items);
  }
}

export type IFinancialVirementRepository = Pick<FinancialVirementRepository, "getAllForPcr" | "updateVirements">;
