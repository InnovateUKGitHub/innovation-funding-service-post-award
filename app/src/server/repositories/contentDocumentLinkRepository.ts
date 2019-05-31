import SalesforceRepositoryBase from "./salesforceRepositoryBase";

interface ISalesforceContentDocumentLink {
  ContentDocumentId: string;
  LinkedEntityId: string;
  ShareType: string;
}

export interface IContentDocumentLinkRepository {
  get(documentId: string, linkedEntityId: string): Promise<ISalesforceContentDocumentLink | null>;
  getAllForEntity(entityId: string): Promise<ISalesforceContentDocumentLink[]>;
  insertContentDocumentLink(contentDocumentId: string, linkedEntityId: string): Promise<string>;
}

export class ContentDocumentLinkRepository extends SalesforceRepositoryBase<ISalesforceContentDocumentLink> implements IContentDocumentLinkRepository {

  protected readonly salesforceObjectName = "ContentDocumentLink";

  protected readonly salesforceFieldNames = [
    "ContentDocumentId",
    "LinkedEntityId"
  ];

  public getAllForEntity(entityId: string): Promise<ISalesforceContentDocumentLink[]> {
    return super.where({ LinkedEntityId: entityId });
  }

  public get(documentId: string, linkedEntityId: string): Promise<ISalesforceContentDocumentLink | null> {
    return super.filterOne({ LinkedEntityId: linkedEntityId, ContentDocumentId: documentId });
  }

  public insertContentDocumentLink(contentDocumentId: string, linkedEntityId: string) {
    return super.insertItem({
      ContentDocumentId: contentDocumentId,
      LinkedEntityId: linkedEntityId,
      ShareType: "V"
    });
  }
}
