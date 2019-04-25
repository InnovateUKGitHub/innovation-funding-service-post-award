import { Connection } from "jsforce";
import { FileUpload } from "@framework/types";
import { Stream } from "stream";
import { ContentDocumentLinkRepository } from "@server/repositories/contentDocumentLinkRepository";
import { ContentDocumentRepository } from "@server/repositories/contentDocumentRepository";
import { ContentVersionRepository } from "@server/repositories/contentVersionRepository";

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

  private contentVersionRepository: ContentVersionRepository;
  private contentDocumentLinkRepository: ContentDocumentLinkRepository;
  private contentDocumentRepository: ContentDocumentRepository;

  public constructor(
    getSalesforceConnection: () => Promise<Connection>
  ) {
    this.contentVersionRepository = new ContentVersionRepository(getSalesforceConnection);
    this.contentDocumentLinkRepository = new ContentDocumentLinkRepository(getSalesforceConnection);
    this.contentDocumentRepository = new ContentDocumentRepository(getSalesforceConnection);
  }

  public async insertDocument(document: FileUpload, recordId: string) {
    const contentVersionId = await this.contentVersionRepository.insertDocument(document);
    const contentVersion = await this.contentVersionRepository.getDocument(contentVersionId);
    const documentId = contentVersion.ContentDocumentId;

    await this.contentDocumentLinkRepository.insertContentDocumentLink(documentId, recordId);
    return documentId;
  }

  public deleteDocument(documentId: string) {
    return this.contentDocumentRepository.delete(documentId);
  }

  public getDocumentsMetadata(documentIds: string[], filter?: DocumentFilter) {
    return this.contentVersionRepository.getDocuments(documentIds, filter);
  }

  public getDocumentMetadata(documentId: string) {
    return this.contentVersionRepository.getDocument(documentId);
  }

  public async getDocumentsMetedataByLinkedRecord(recordId: string, filter?: DocumentFilter) {
    const linkedDocs = await this.contentDocumentLinkRepository.getAllForEntity(recordId);
    if (!linkedDocs || !linkedDocs.length) {
      return [];
    }
    return this.getDocumentsMetadata(linkedDocs.map(x => x.ContentDocumentId), filter);
  }

  public getDocumentContent(documentId: string) {
    return this.contentVersionRepository.getDocumentData(documentId);
  }
}
