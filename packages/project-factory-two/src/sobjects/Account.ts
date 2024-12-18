import { SObjectFieldType } from "../types/SObjectFieldType";
import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Account extends AbstractSObject {
  public readonly sobject = "Account";

  @SObjectField({ nullable: true, readonly: false })
  accessor Acc_FundingStatus__c: SObjectFieldType<
    | "Fund"
    | "Fund with care"
    | "Do not fund"
    | "Refer OIG"
    | "Refer CFIS"
    | "Monitor with care"
    | "Refer Loans"
    | "Agreed assurance"
  >;

  @SObjectField({ nullable: true, readonly: false })
  accessor JES_Organisation__c: SObjectFieldType<"Yes" | "No">;

  @SObjectField({ nullable: false, readonly: false })
  accessor OrgMigrationId__c: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Name: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor BillingStreet: SObjectFieldType<string>;

  @SObjectField({ nullable: true, readonly: false })
  accessor BillingCity: SObjectFieldType<string>;

  @SObjectField({ nullable: true, readonly: false })
  accessor BillingState: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor BillingPostalCode: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor BillingCountry: SObjectFieldType<string>;
}

export { Account };
