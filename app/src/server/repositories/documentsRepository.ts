import { Connection } from "jsforce";
import { Stream } from "stream";
import { ContentDocumentLinkRepository } from "@server/repositories/contentDocumentLinkRepository";
import { ContentDocumentRepository } from "@server/repositories/contentDocumentRepository";
import { ContentVersionRepository } from "@server/repositories/contentVersionRepository";
import { ILogger } from "@server/features/common";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { DocumentEntity } from "@framework/entities/document";
import { DocumentDescriptionMapper, SalesforceDocumentMapper } from "@server/repositories/mappers/documentMapper";
import { DocumentDescription } from "@framework/constants";
import { DocumentFilter } from "@framework/types/DocumentFilter";

export interface IDocumentsRepository {
  insertDocument(document: IFileWrapper, recordId: string, description?: DocumentDescription): Promise<string>;
  deleteDocument(documentId: string): Promise<void>;
  isExistingDocument(documentId: string, recordId: string): Promise<boolean>;
  getDocumentContent(verionId: string): Promise<Stream>;
  getDocumentMetadata(verionId: string): Promise<DocumentEntity>;
  getDocumentMetadataForEntityDocument(entityId: string, verionId: string): Promise<DocumentEntity|null>;
  getDocumentsMetadata(documentIds: string[], filter?: DocumentFilter): Promise<DocumentEntity[]>;
  getDocumentsMetedataByLinkedRecord(recordId: string, filter?: DocumentFilter): Promise<DocumentEntity[]>;
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

  public async insertDocument(document: IFileWrapper, recordId: string, description?: DocumentDescription) {
    const sfDescription = new DocumentDescriptionMapper().mapToSalesforceDocumentDescription(description);
    const contentVersionId = await this.contentVersionRepository.insertDocument(document as ServerFileWrapper, sfDescription);
    const contentVersion = await this.contentVersionRepository.getDocument(contentVersionId);
    const documentId = contentVersion.ContentDocumentId;

    await this.contentDocumentLinkRepository.insertContentDocumentLink(documentId, recordId);
    return documentId;
  }

  public deleteDocument(documentId: string) {
    return this.contentDocumentRepository.delete(documentId);
  }

  public async getDocumentsMetadata(documentIds: string[], filter?: DocumentFilter) {
    const documents = await this.contentVersionRepository.getDocuments(documentIds, filter);
    const mapper = new SalesforceDocumentMapper();
    return documents.map(x => mapper.map(x));
  }

  public async getDocumentMetadata(versionId: string) {
    const document = await this.contentVersionRepository.getDocument(versionId);
    return new SalesforceDocumentMapper().map(document);
  }

  public async isExistingDocument(documentId: string, recordId: string): Promise<boolean> {
    const documentLink = await this.contentDocumentLinkRepository.get(documentId, recordId);
    return !!documentLink;
  }

  public async getDocumentMetadataForEntityDocument(entityId: string, versionId: string) {
    // @TODO: try to improve this in terms of numbers of calls
    // however salesforce makes it difficult to do this !!!
    const docIds = await this.contentDocumentLinkRepository.getAllForEntity(entityId).then(x => x.map(y => y.ContentDocumentId));
    const versions = await this.contentVersionRepository.getDocuments(docIds);
    const document = versions.find(x => x.Id === versionId) || null;
    return document ? new SalesforceDocumentMapper().map(document) : null;
  }

  public async getDocumentsMetedataByLinkedRecord(recordId: string, filter?: DocumentFilter) {
    const linkedDocs = await this.contentDocumentLinkRepository.getAllForEntity(recordId);
    if (!linkedDocs || !linkedDocs.length) {
      return [];
    }
    return this.getDocumentsMetadata(linkedDocs.map(x => x.ContentDocumentId), filter);
  }

  public getDocumentContent(versionId: string) {
    return this.contentVersionRepository.getDocumentData(versionId);
  }
}
