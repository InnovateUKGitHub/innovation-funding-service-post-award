import { Connection } from "jsforce";
import { BulkOperation } from "jsforce/lib/api/bulk";
import { ApiName, BulkLoadableApiName } from "../enum/ApiName";
import { LoaderManager } from "../LoaderManager";

export interface IBaseLoader {
  apiName: ApiName;
  externalId?: string;
  relationshipMap: Map<BulkLoadableApiName, string>;
  manager: LoaderManager;
  operation: BulkOperation;
  prefix: string;
  startDate: Date;
}

export abstract class BaseLoader<IPayload, IReturn> {
  apiName: string;
  externalId?: string;
  relationshipMap: Map<BulkLoadableApiName, string>;
  manager: LoaderManager;
  operation: BulkOperation;
  prefix: string;
  startDate: Date;

  constructor({
    apiName,
    externalId,
    relationshipMap,
    manager,
    operation,
    prefix,
    startDate,
  }: IBaseLoader) {
    this.apiName = apiName;
    this.externalId = externalId;
    this.relationshipMap = relationshipMap;
    this.manager = manager;
    this.operation = operation;
    this.prefix = prefix;
    this.startDate = startDate;
  }

  abstract load(
    conn: Connection<any>,
    payload: IPayload[],
    override?: Map<string, any>
  ): Promise<IReturn>;
}
