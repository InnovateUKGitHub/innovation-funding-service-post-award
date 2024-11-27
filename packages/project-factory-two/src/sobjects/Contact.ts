import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Contact extends AbstractSObject {
  public readonly sobject = "Contact";

  @SObjectField({ nullable: false, readonly: false })
  accessor ContactMigrationId__c: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor FirstName: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor LastName: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor Email: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor AccountId: string | undefined;
}

export { Contact };
