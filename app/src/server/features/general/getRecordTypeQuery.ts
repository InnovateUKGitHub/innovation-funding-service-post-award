import { BadRequestError, QueryBase } from "../common";
import { IContext } from "@framework/types";
import { RecordType } from "@framework/entities/recordType";
import { GetAllRecordTypesQuery } from "./getAllRecordTypesQuery";

export class GetRecordTypeQuery extends QueryBase<RecordType> {
  constructor(private readonly parent: string, private readonly type: string) {
    super();
  }

  protected async Run(context: IContext): Promise<RecordType> {
    const recordTypes = await context.runQuery(new GetAllRecordTypesQuery());
    const recordType = recordTypes.find(x => x.parent === this.parent && x.type === this.type);

    if(!recordType) {
      throw new BadRequestError(`Record type not found for ${this.parent} and ${this.type}`);
    }

    return recordType;
  }

}
