import SalesforceRepositoryBase from "./salesforceRepositoryBase";
import { Connection } from "jsforce";
import { ILogger } from "@server/features/common";

export interface ISalesforceRecordType {
  Id: string;
  Name: string;
  SobjectType: string;
}

export interface IRecordTypeRepository {
  getAll(): Promise<ISalesforceRecordType[]>;
  getAllForObject(objectType: string): Promise<ISalesforceRecordType[]>;
  get(objectType: string, recordTypeName: string): Promise<ISalesforceRecordType>;
}

export class RecordTypeRepository extends SalesforceRepositoryBase<ISalesforceRecordType> implements IRecordTypeRepository {

  constructor(private cache: ICache<ISalesforceRecordType[]>, getSalesforceConnection: () => Promise<Connection>, logger: ILogger) {
    super(getSalesforceConnection, logger);
  }

  protected readonly salesforceObjectName = "RecordType";

  protected readonly salesforceFieldNames = [
    "Id",
    "Name",
    "SobjectType"
  ];

  async getAll(): Promise<ISalesforceRecordType[]> {
    return this.cache.fetchAsync("all", () => super.all());
  }

  async getAllForObject(objectType: string) {
    return this.getAll().then(x => x.filter(y => y.SobjectType === objectType));
  }

  async get(objectType: string, recordTypeName: string) {
    return this.getAll().then(x => {
      const item = x.find(y => y.SobjectType === objectType && y.Name === recordTypeName);
      if(!item) {
        throw Error(`Failed to find record type of ${recordTypeName} for object ${objectType}`);
      }
      return item;
    });
  }
}
