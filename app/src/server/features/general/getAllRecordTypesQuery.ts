import { RecordType } from "@framework/entities/recordType";
import { IContext } from "@framework/types/IContext";
import { QueryBase } from "../common/queryBase";

export class GetAllRecordTypesQuery extends QueryBase<RecordType[]> {
  constructor() {
    super();
  }

  protected run(context: IContext): Promise<RecordType[]> {
    return context.caches.recordTypes.fetchAsync("all", () => context.repositories.recordTypes.getAll());
  }
}
