import { Acc_Claims__c } from "./Acc_Claims__c";
import { Acc_CostCategory__c } from "./Acc_CostCategory__c";
import { Acc_Profile__c } from "./Acc_Profile__c";
import { Acc_Project__c } from "./Acc_Project__c";
import { Acc_ProjectContactLink__c } from "./Acc_ProjectContactLink__c";
import { Account } from "./Account";
import { Competition__c } from "./Competition__c";
import { Contact } from "./Contact";
import { RecordType } from "./RecordType";
import { Trigger__mdt } from "./Trigger__mdt";
import { User } from "./User";

const sobjects = {
  Acc_Claims__c: Acc_Claims__c,
  Acc_CostCategory__c: Acc_CostCategory__c,
  Acc_Profile__c: Acc_Profile__c,
  Acc_Project__c: Acc_Project__c,
  Acc_ProjectContactLink__c: Acc_ProjectContactLink__c,
  Account: Account,
  Competition__c: Competition__c,
  Contact: Contact,
  RecordType: RecordType,
  Trigger__mdt: Trigger__mdt,
  User: User,
} as const;

type SObjectNames = keyof typeof sobjects;

type GetSobjectName<T> = T extends `SELECT ${string} FROM ${infer Q extends SObjectNames}`
  ? Q
  : T extends `SELECT ${string} FROM ${infer R extends SObjectNames} ${string}`
    ? R
    : never;

type SObjectInstanceFromQuery<T> = InstanceType<(typeof sobjects)[GetSobjectName<T>]>;

export { sobjects, GetSobjectName, SObjectInstanceFromQuery };
