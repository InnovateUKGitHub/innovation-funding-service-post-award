import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class Trigger__mdt extends AbstractSObject {
  public readonly sobject = "Trigger__mdt";

  @SObjectField({ nullable: false, readonly: false })
  accessor DeveloperName: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor IsDisabled__c: boolean | undefined;
}

export { Trigger__mdt };
