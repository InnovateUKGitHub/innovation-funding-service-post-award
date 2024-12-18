import { SObjectFieldType } from "../types/SObjectFieldType";
import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";
import { Acc_Project__c } from "./Acc_Project__c";
import { Account } from "./Account";
import { Contact } from "./Contact";
import { User } from "./User";

type Role =
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
  | "Relationship Manager";

class Acc_ProjectContactLink__c extends AbstractSObject {
  public readonly sobject = "Acc_ProjectContactLink__c";

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_Role__c: SObjectFieldType<Role>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_EmailOfSFContact__c: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ProjectId__c: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_AccountId__c: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_ContactId__c: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Acc_UserId__c: SObjectFieldType<string>;

  static fromSobject({
    user,
    contact,
    account,
    project,
    role,
  }: {
    user: User;
    contact: Contact;
    account: Account;
    project: Acc_Project__c;
    role: Role;
  }) {
    const pcl = new Acc_ProjectContactLink__c();
    pcl.Acc_AccountId__c = account.Id;
    pcl.Acc_ContactId__c = contact.Id;
    pcl.Acc_ProjectId__c = project.Id;
    pcl.Acc_UserId__c = user.Id;
    pcl.Acc_EmailOfSFContact__c = contact.Email;
    pcl.Acc_Role__c = role;
    return pcl;
  }
}

export { Acc_ProjectContactLink__c };
