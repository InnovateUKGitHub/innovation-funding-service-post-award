import SalesforceBase from "./salesforceBase";
import { Connection } from "jsforce";

export interface ISalesforceContentDocumentLink {
  ContentDocumentId: string;
  LinkedEntityId: string;
  ShareType: string;
}

const fieldNames: (keyof ISalesforceContentDocumentLink)[] = [
  "ContentDocumentId",
  "LinkedEntityId"
];

export interface IContentDocumentLinkRepository {
  getAllForEntity(entityId: string): Promise<ISalesforceContentDocumentLink[]>;
  insertContentDocumentLink(contentDocumentId: string, linkedEntityId: string): Promise<string>;
}

export class ContentDocumentLinkRepository extends SalesforceBase<ISalesforceContentDocumentLink> implements IContentDocumentLinkRepository {

  constructor(connection: () => Promise<Connection>) {
    super(connection, "ContentDocumentLink", fieldNames);
  }

  public getAllForEntity(entityId: string): Promise<ISalesforceContentDocumentLink[]> {
    return super.where({ LinkedEntityId: entityId });
  }

  public insertContentDocumentLink(contentDocumentId: string, linkedEntityId: string) {
    return super.insert({
      ContentDocumentId: contentDocumentId,
      LinkedEntityId: linkedEntityId,
      ShareType: "V"
    });
  }
}
