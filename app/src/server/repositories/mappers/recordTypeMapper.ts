import { SalesforceBaseMapper } from "./saleforceMapperBase";
import { ISalesforceRecordType } from "../recordTypeRepository";
import { RecordType } from "@framework/entities";

export class SalesforceRecordTypeMapper extends SalesforceBaseMapper<ISalesforceRecordType, RecordType> {
  public map(item: ISalesforceRecordType): RecordType {
    return {
      id: item.Id,
      parent: item.SobjectType,
      type: item.Name
    };
  }
}
