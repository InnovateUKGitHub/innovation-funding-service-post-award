import { sss } from "@server/util/salesforce-string-helpers";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";

interface ISalesforceContentDocumentLink {
  Id: string;
  ContentDocumentId: string;
  LinkedEntityId: string;
  ShareType: string;
}

export interface IContentDocumentLinkRepository {
  get(documentId: string, linkedEntityId: string): Promise<ISalesforceContentDocumentLink | null>;
  getFromDocumentId(documentId: string): Promise<ISalesforceContentDocumentLink[]>;
  getAllForEntity(entityId: string): Promise<ISalesforceContentDocumentLink[]>;
  insertContentDocumentLink(contentDocumentId: string, linkedEntityId: string): Promise<string>;
}

export class ContentDocumentLinkRepository
  extends SalesforceRepositoryBase<ISalesforceContentDocumentLink>
  implements IContentDocumentLinkRepository
{
  protected readonly salesforceObjectName = "ContentDocumentLink";

  protected readonly salesforceFieldNames = ["Id", "ContentDocumentId", "LinkedEntityId"];

  public getAllForEntity(entityId: string): Promise<ISalesforceContentDocumentLink[]> {
    return super.where({ LinkedEntityId: entityId });
  }

  public get(documentId: string, linkedEntityId: string): Promise<ISalesforceContentDocumentLink | null> {
    return super.filterOne({ LinkedEntityId: linkedEntityId, ContentDocumentId: documentId });
  }

  public getFromDocumentId(documentId: string): Promise<ISalesforceContentDocumentLink[]> {
    return super.where(`ContentDocumentId = '${sss(documentId)}'`);
  }

  public insertContentDocumentLink(contentDocumentId: string, linkedEntityId: string) {
    return super.insertItem({
      ContentDocumentId: contentDocumentId,
      LinkedEntityId: linkedEntityId,
      ShareType: "V",
    });
  }
}
