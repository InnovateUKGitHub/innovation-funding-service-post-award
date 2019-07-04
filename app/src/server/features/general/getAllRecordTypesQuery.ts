import { BadRequestError, QueryBase } from "../common";
import { IContext } from "@framework/types";
import { RecordType } from "@framework/entities/recordType";

export class GetAllRecordTypesQuery extends QueryBase<RecordType[]> {
  constructor() {
    super();
  }

  protected async Run(context: IContext): Promise<RecordType[]> {
    return await context.caches.recordTypes.fetchAsync("all", () => context.repositories.recordTypes.getAll());
  }
}
