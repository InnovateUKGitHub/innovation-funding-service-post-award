import { RecordType } from "@framework/entities/recordType";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";

export class GetAllRecordTypesQuery extends AuthorisedAsyncQueryBase<RecordType[]> {
  public readonly runnableName: string = "GetAllRecordTypesQuery";
  constructor() {
    super();
  }

  protected run(context: IContext): Promise<RecordType[]> {
    return context.caches.recordTypes.fetchAsync("all", () => context.repositories.recordTypes.getAll());
  }
}
