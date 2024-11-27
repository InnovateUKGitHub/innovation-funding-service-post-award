import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class RecordType extends AbstractSObject {
  public readonly sobject = "RecordType";

  @SObjectField({ nullable: false, readonly: false })
  accessor SobjectType: string | undefined;

  @SObjectField({ nullable: false, readonly: false })
  accessor DeveloperName: string | undefined;
}

export { RecordType };
