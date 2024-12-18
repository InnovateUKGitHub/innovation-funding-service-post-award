import { SObjectFieldType } from "../types/SObjectFieldType";
import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Contact extends AbstractSObject {
  public readonly sobject = "Contact";

  @SObjectField({ nullable: true, readonly: false })
  accessor ContactMigrationId__c: SObjectFieldType<string>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Salutation: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor FirstName: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor LastName: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor Email: SObjectFieldType<string>;

  @SObjectField({ nullable: true, readonly: false })
  accessor Email__c: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor AccountId: SObjectFieldType<string>;
}

export { Contact };
