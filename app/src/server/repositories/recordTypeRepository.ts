import SalesforceBase from "./salesforceBase";

export interface ISalesforceRecordType {
    Id: string;
    Name: string;
    SobjectType: string;
}

const fieldNames: string[] = [
  "Id",
  "Name",
  "SobjectType"
];

export interface IRecordTypeRepository {
    getAll(): Promise<ISalesforceRecordType[]>;
}

export class RecordTypeRepository extends SalesforceBase<ISalesforceRecordType> implements IRecordTypeRepository {
    constructor() {
        super("RecordType", fieldNames);
    }

    getAll(): Promise<ISalesforceRecordType[]> {
        return super.all();
    }
}
