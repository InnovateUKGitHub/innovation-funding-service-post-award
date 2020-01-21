import { SalesforceRepositoryBaseWithMapping } from "./salesforceRepositoryBase";
import { Connection } from "jsforce";
import { ILogger } from "@server/features/common";
import { RecordType } from "@framework/entities";
import { SalesforceRecordTypeMapper } from "./mappers/recordTypeMapper";

export interface ISalesforceRecordType {
  Id: string;
  Name: string;
  SobjectType: string;
}

export interface IRecordTypeRepository {
  getAll(): Promise<RecordType[]>;
}

/**
 * Record Types are used in salesforce as an inheritance discriminator
 *
 * The id is needed when querying and inserting records where multiple types are stored in a single table
 */
export class RecordTypeRepository extends SalesforceRepositoryBaseWithMapping<ISalesforceRecordType, RecordType> implements IRecordTypeRepository {

  constructor(getSalesforceConnection: () => Promise<Connection>, logger: ILogger) {
    super(getSalesforceConnection, logger);
  }

  protected mapper = new SalesforceRecordTypeMapper();

  protected readonly salesforceObjectName = "RecordType";

  protected readonly salesforceFieldNames = [
    "Id",
    "Name",
    "SobjectType"
  ];

  async getAll() {
    return super.all();
  }
}
