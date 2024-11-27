import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Acc_Claims__c extends AbstractSObject {
  public readonly sobject = "Acc_Claims__c";

  @SObjectField({ nullable: false, readonly: false })
  accessor RecordTypeId: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ClaimStatus__c:
    | "Draft"
    | "Independent accountant's report required"
    | "New"
    | "Paid"
    | "Payment being processed"
    | "Queried by Innovate UK"
    | "Queried by Monitoring Officer"
    | "Submitted to Innovate UK"
    | "Submitted to Monitoring Officer"
    | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ProjectPeriodNumber__c: number | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ProjectParticipant__c: string | undefined;
}

export { Acc_Claims__c };
