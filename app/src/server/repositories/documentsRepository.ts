import { FileUpload } from "@framework/types";
import { ContentVersionRepository } from "@server/repositories/contentVersionRepository";
import { Connection } from "jsforce";
import { ContentDocumentLinkRepository } from "@server/repositories/contentDocumentLinkRepository";
import { ContentDocumentRepository } from "@server/repositories/contentDocumentRepository";
import { Stream } from "stream";

export interface ISalesforceDocument {
  Id: string;
  Title: string;
  FileExtension: string | null;
  ContentDocumentId: string;
  ContentSize: number;
  FileType: string | null;
  ReasonForChange: string;
  PathOnClient: string;
  ContentLocation: string;
  VersionData: string;
  Description?: string;
  CreatedDate: string;
  Owner: {
    Username: string
  };
}

export interface IDocumentsRepository {
  insertDocument(document: FileUpload, recordId: string): Promise<string>;
  deleteDocument(documentId: string): Promise<void>;
  getDocumentContent(documentId: string): Promise<Stream>;
  getDocumentMetadata(documentId: string): Promise<ISalesforceDocument>;
  getDocumentsMetadata(documentIds: string[], filter?: DocumentFilter): Promise<ISalesforceDocument[]>;
  getDocumentsMetedataByLinkedRecord(recordId: string, filter?: DocumentFilter): Promise<ISalesforceDocument[]>;
}

export class DocumentsRepository implements IDocumentsRepository {

  public constructor(
    protected getSalesforceConnection: () => Promise<Connection>
  ) { }

  public async insertDocument(document: FileUpload, recordId: string) {
    const contentVersionId = await new ContentVersionRepository(this.getSalesforceConnection).insertDocument(document);
    const contentVersion = await new ContentVersionRepository(this.getSalesforceConnection).getDocument(contentVersionId);
    const documentId = contentVersion.ContentDocumentId;
    await new ContentDocumentLinkRepository(this.getSalesforceConnection).insertContentDocumentLink(documentId, recordId);
    return documentId;
  }

  public deleteDocument(documentId: string) {
    return new ContentDocumentRepository(this.getSalesforceConnection).delete(documentId);
  }

  public getDocumentsMetadata(documentIds: string[], filter?: DocumentFilter) {
    return new ContentVersionRepository(this.getSalesforceConnection).getDocuments(documentIds, filter);
  }

  public getDocumentMetadata(documentId: string) {
    return new ContentVersionRepository(this.getSalesforceConnection).getDocument(documentId);
  }

  public async getDocumentsMetedataByLinkedRecord(recordId: string, filter?: DocumentFilter) {
    const linkedDocs = await new ContentDocumentLinkRepository(this.getSalesforceConnection).getAllForEntity(recordId);
    if (!linkedDocs || !linkedDocs.length) {
      return [];
    }
    return this.getDocumentsMetadata(linkedDocs.map(x => x.ContentDocumentId), filter);
  }

  public getDocumentContent(documentId: string) {
    return new ContentVersionRepository(this.getSalesforceConnection).getDocumentData(documentId);
  }
}
