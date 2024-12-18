import { SObjectFieldType } from "../types/SObjectFieldType";
import { AbstractSObject, SObjectField } from "./AbstractProjectFactory";

class RecordType extends AbstractSObject {
  public readonly sobject = "RecordType";

  @SObjectField({ nullable: false, readonly: false })
  accessor SobjectType: SObjectFieldType<string>;

  @SObjectField({ nullable: false, readonly: false })
  accessor DeveloperName: SObjectFieldType<string>;
}

export { RecordType };
