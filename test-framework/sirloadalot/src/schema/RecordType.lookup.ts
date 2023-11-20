import { ApiName } from "../enum/ApiName";
import { RecordType } from "../enum/RecordType";

interface RecordTypeLookup<TRecordType extends RecordType, TApiName extends ApiName> {
  type: "RecordType";
  DeveloperName: TRecordType;
  SobjectType: TApiName;
}

export { RecordTypeLookup };
