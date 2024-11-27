import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Acc_ProjectContactLink__c extends AbstractSObject {
  public readonly sobject = "Acc_ProjectContactLink__c";

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_Role__c:
    | "Finance contact"
    | "Monitoring officer"
    | "Project Manager"
    | "Innovation Lead"
    | "IPM"
    | "Claims Notification"
    | "PCR Notification"
    | "Investor"
    | "Associate"
    | "Company Supervisor"
    | "Main Company Contact"
    | "KB Supervisor"
    | "Main KB Contact"
    | "KB Admin"
    | "KB Finance"
    | "Final Report Assessor"
    | "Contracting Authority"
    | "Relationship Manager"
    | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_EmailOfSFContact__c: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ProjectId__c: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_AccountId__c: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ContactId__c: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_UserId__c: string | undefined;
}

export { Acc_ProjectContactLink__c };
