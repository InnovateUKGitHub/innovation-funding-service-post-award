import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Competition__c extends AbstractSObject {
  public readonly sobject = "Competition__c";

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_CompetitionCode__c: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_CompetitionType__c: "CR&D" | "KTP" | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_CompetitionName__c: string | undefined;
}

export { Competition__c };
