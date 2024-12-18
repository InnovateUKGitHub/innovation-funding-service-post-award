import { ClaimStatus } from "../types/ClaimStatus";
import { SObjectFieldType } from "../types/SObjectFieldType";
import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Acc_Claims__c extends AbstractSObject {
  public readonly sobject = "Acc_Claims__c";

  @SObjectField({ nullable: false, readonly: false })
  accessor RecordTypeId: SObjectFieldType<string>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_ClaimStatus__c: SObjectFieldType<ClaimStatus>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ProjectPeriodNumber__c: SObjectFieldType<number>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ProjectParticipant__c: SObjectFieldType<string>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_CostCategory__c: SObjectFieldType<string>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_ParentId__c: SObjectFieldType<string>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_LineItemCost__c: SObjectFieldType<number>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_LineItemDescription__c: SObjectFieldType<string>;
}

export { Acc_Claims__c };
