import SalesforceRepositoryBase from "./salesforceRepositoryBase";

interface ISalesforceContentDocumentLink {
  ContentDocumentId: string;
  LinkedEntityId: string;
  ShareType: string;
}

export interface IContentDocumentLinkRepository {
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

  public insertContentDocumentLink(contentDocumentId: string, linkedEntityId: string) {
    return super.insertItem({
      ContentDocumentId: contentDocumentId,
      LinkedEntityId: linkedEntityId,
      ShareType: "V"
    });
  }
}
