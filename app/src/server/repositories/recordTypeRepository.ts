import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceRecordType {
  Id: string;
  Name: string;
  SobjectType: string;
}

export interface IRecordTypeRepository {
  getAll(): Promise<ISalesforceRecordType[]>;
}

export class RecordTypeRepository extends SalesforceRepositoryBase<ISalesforceRecordType> implements IRecordTypeRepository {

  protected readonly salesforceObjectName = "RecordType";

  protected readonly salesforceFieldNames = [
    "Id",
    "Name",
    "SobjectType"
  ];

  getAll(): Promise<ISalesforceRecordType[]> {
    return super.all();
  }
}
