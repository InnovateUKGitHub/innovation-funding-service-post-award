import { SObjectFieldType } from "../types/SObjectFieldType";
import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Trigger__mdt extends AbstractSObject {
  public readonly sobject = "Trigger__mdt";

  @SObjectField({ nullable: false, readonly: false })
  accessor DeveloperName: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor IsDisabled__c: SObjectFieldType<boolean>;
}

export { Trigger__mdt };
