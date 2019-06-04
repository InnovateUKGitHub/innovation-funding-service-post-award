import { Connection } from "jsforce";
import { FileUpload } from "@framework/types";
import { Stream } from "stream";
import { ContentDocumentLinkRepository } from "@server/repositories/contentDocumentLinkRepository";
import { ContentDocumentRepository } from "@server/repositories/contentDocumentRepository";
import { ContentVersionRepository } from "@server/repositories/contentVersionRepository";
import { ILogger } from "@server/features/common";

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
  isExistingDocument(documentId: string, recordId: string): Promise<boolean>;
  getDocumentContent(documentId: string): Promise<Stream>;
  getDocumentMetadata(documentId: string): Promise<ISalesforceDocument>;
  getDocumentMetadataForEntityDocument(entityId: string, documentId: string): Promise<ISalesforceDocument|null>;
  getDocumentsMetadata(documentIds: string[], filter?: DocumentFilter): Promise<ISalesforceDocument[]>;
  getDocumentsMetedataByLinkedRecord(recordId: string, filter?: DocumentFilter): Promise<ISalesforceDocument[]>;
}

export class DocumentsRepository implements IDocumentsRepository {

  private contentVersionRepository: ContentVersionRepository;
  private contentDocumentLinkRepository: ContentDocumentLinkRepository;
  private contentDocumentRepository: ContentDocumentRepository;

  public constructor(
    getSalesforceConnection: () => Promise<Connection>,
    logger: ILogger
  ) {
    this.contentVersionRepository = new ContentVersionRepository(getSalesforceConnection, logger);
    this.contentDocumentLinkRepository = new ContentDocumentLinkRepository(getSalesforceConnection, logger);
    this.contentDocumentRepository = new ContentDocumentRepository(getSalesforceConnection, logger);
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

  public async isExistingDocument(documentId: string, recordId: string): Promise<boolean> {
    const documentLink = await this.contentDocumentLinkRepository.get(documentId, recordId);
    return !!documentLink;
  }

  public async getDocumentMetadataForEntityDocument(entityId: string, documentId: string) {
    const linkedDoc = await this.contentDocumentLinkRepository.get(documentId, entityId);
    if(linkedDoc) {
      return this.contentVersionRepository.getDocument(documentId);
    }
    return null;
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
