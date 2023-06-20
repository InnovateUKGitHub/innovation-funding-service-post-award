import { RecordType } from "@framework/entities/recordType";
import { ISalesforceRecordType } from "../recordTypeRepository";
import { SalesforceBaseMapper } from "./salesforceMapperBase";

export class SalesforceRecordTypeMapper extends SalesforceBaseMapper<ISalesforceRecordType, RecordType> {
  public map(item: ISalesforceRecordType): RecordType {
    return {
      id: item.Id,
      parent: item.SobjectType,
      type: item.Name,
    };
  }
}
