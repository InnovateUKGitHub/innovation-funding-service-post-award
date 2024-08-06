import { RecordType } from "@framework/entities/recordType";
import { IContext } from "@framework/types/IContext";
import { BadRequestError } from "../common/appError";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";
import { GetAllRecordTypesQuery } from "./getAllRecordTypesQuery";

export class GetRecordTypeQuery extends AuthorisedAsyncQueryBase<RecordType> {
  public readonly runnableName: string = "GetRecordTypeQuery";
  constructor(
    private readonly parent: string,
    private readonly type: string,
  ) {
    super();
  }

  protected async run(context: IContext): Promise<RecordType> {
    const recordTypes = await context.runQuery(new GetAllRecordTypesQuery());

    const recordType = recordTypes.find(x => x.parent === this.parent && x.type === this.type);

    if (!recordType) {
      throw new BadRequestError(`Record type not found for ${this.parent} and ${this.type}`);
    }

    return recordType;
  }
}
