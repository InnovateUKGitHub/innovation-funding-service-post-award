import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Contact extends AbstractSObject {
  public readonly sobject = "Contact";

  @SObjectField({ nullable: false })
  accessor ContactMigrationId__c: string | undefined;

  @SObjectField({ nullable: false })
  accessor FirstName: string | undefined;

  @SObjectField({ nullable: false })
  accessor LastName: string | undefined;

  @SObjectField({ nullable: false })
  accessor Email: string | undefined;

  @SObjectField({ nullable: false })
  accessor AccountId: string | undefined;
}

export { Contact };
