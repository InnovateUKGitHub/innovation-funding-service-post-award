import SalesforceBase from "./salesforceBase";
import { Connection } from "jsforce";

export interface ISalesforceContentDocumentLink {
  ContentDocumentId: string;
  LinkedEntityId: string;
}

const fieldNames: (keyof ISalesforceContentDocumentLink)[] = [
  "ContentDocumentId",
  "LinkedEntityId"
];

export interface IContentDocumentLinkRepository {
  getAllForEntity(entityId: string): Promise<ISalesforceContentDocumentLink[]>;
}

export class ContentDocumentLinkRepository extends SalesforceBase<ISalesforceContentDocumentLink> implements IContentDocumentLinkRepository {

  constructor(connection: () => Promise<Connection>) {
    super(connection, "ContentDocumentLink", fieldNames);
  }

  public getAllForEntity(entityId: string): Promise<ISalesforceContentDocumentLink[]> {
    return super.whereFilter({ LinkedEntityId: entityId });
  }
}
