import { ILogger } from "@shared/logger";
import { SalesforceRepositoryBaseWithMapping } from "./salesforceRepositoryBase";
import { SalesforceRecordTypeMapper } from "./mappers/recordTypeMapper";
import { RecordType } from "@framework/entities/recordType";
import { TsforceConnection } from "@server/tsforce/TsforceConnection";

export interface ISalesforceRecordType {
  Id: string;
  Name: string;
  SobjectType: string;
  DeveloperName: string;
}

export interface IRecordTypeRepository {
  getAll(): Promise<RecordType[]>;
}

/**
 * Record Types are used in salesforce as an inheritance discriminator
 *
 * The id is needed when querying and inserting records where multiple types are stored in a single table
 */
export class RecordTypeRepository
  extends SalesforceRepositoryBaseWithMapping<ISalesforceRecordType, RecordType>
  implements IRecordTypeRepository
{
  constructor(getSalesforceConnection: () => TsforceConnection, logger: ILogger) {
    super(getSalesforceConnection, logger);
  }

  protected mapper = new SalesforceRecordTypeMapper();

  protected readonly salesforceObjectName = "RecordType";

  protected readonly salesforceFieldNames = ["Id", "Name", "SobjectType", "DeveloperName"];

  async getAll() {
    return super.all();
  }
}
