import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Acc_CostCategory__c extends AbstractSObject {
  public readonly sobject = "Acc_CostCategory__c";

  // It's not meant to be, but there are some in Salesforce
  // that are just... null ¯\_(ツ)_/¯
  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_CompetitionType__c: string | undefined;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_OrganisationType__c: string | undefined;
}

export { Acc_CostCategory__c };
