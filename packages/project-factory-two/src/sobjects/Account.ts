import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Account extends AbstractSObject {
  public readonly sobject = "Account";

  @SObjectField({ nullable: false, readonly: false })
  accessor OrgMigrationId__c: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Name: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor BillingStreet: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor BillingCity: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor BillingState: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor BillingPostalCode: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor BillingCountry: string | undefined;
}

export { Account };
