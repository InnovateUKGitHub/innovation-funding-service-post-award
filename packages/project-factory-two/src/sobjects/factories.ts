import { Acc_Project__c } from "./Acc_Project__c";
import { Acc_ProjectContactLink__c } from "./Acc_ProjectContactLink__c";
import { Account } from "./Account";
import { Competition__c } from "./Competition__c";
import { Contact } from "./Contact";
import { User } from "./User";

const sobjects = {
  Acc_Project__c: Acc_Project__c,
  Acc_ProjectContactLink__c: Acc_ProjectContactLink__c,
  Account: Account,
  Competition__c: Competition__c,
  Contact: Contact,
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
