import { SObjectFieldType } from "../types/SObjectFieldType";
import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Acc_CostCategory__c extends AbstractSObject {
  public readonly sobject = "Acc_CostCategory__c";

  // It's not meant to be, but there are some in Salesforce
  // that are just... null ¯\_(ツ)_/¯
  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_CompetitionType__c: SObjectFieldType<string>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_OrganisationType__c: SObjectFieldType<string>;
}

export { Acc_CostCategory__c };
