import SalesforceBase from "./salesforceBase";
import {Connection} from "jsforce";

export interface ISalesforceContentDocument {
  Id: string;
}

export interface IContentDocumentRepository {
  delete(id: string): Promise<void>;
}

const fieldNames: (keyof ISalesforceContentDocument)[] = ["Id"];

export class ContentDocumentRepository extends SalesforceBase<ISalesforceContentDocument> implements IContentDocumentRepository {

  constructor(connection: () => Promise<Connection>) {
    super(connection, "ContentDocument", fieldNames);
  }

  public delete(id: string): Promise<void> {
    return super.delete(id);
  }
}
