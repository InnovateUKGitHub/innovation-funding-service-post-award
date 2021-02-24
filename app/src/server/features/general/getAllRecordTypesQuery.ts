import { IContext } from "@framework/types";
import { RecordType } from "@framework/entities/recordType";
import { QueryBase } from "../common";

export class GetAllRecordTypesQuery extends QueryBase<RecordType[]> {
  constructor() {
    super();
  }

  protected Run(context: IContext): Promise<RecordType[]> {
    return context.caches.recordTypes.fetchAsync("all", () => context.repositories.recordTypes.getAll());
  }
}
