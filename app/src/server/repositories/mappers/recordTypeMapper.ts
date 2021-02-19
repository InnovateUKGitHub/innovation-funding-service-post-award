import { RecordType } from "@framework/entities";
import { ISalesforceRecordType } from "../recordTypeRepository";
import { SalesforceBaseMapper } from "./saleforceMapperBase";

export class SalesforceRecordTypeMapper extends SalesforceBaseMapper<ISalesforceRecordType, RecordType> {
  public map(item: ISalesforceRecordType): RecordType {
    return {
      id: item.Id,
      parent: item.SobjectType,
      type: item.Name
    };
  }
}
