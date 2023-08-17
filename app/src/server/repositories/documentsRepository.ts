import { Stream } from "stream";
import { Connection } from "jsforce";
import { ContentDocumentLinkRepository } from "@server/repositories/contentDocumentLinkRepository";
import { ContentDocumentRepository } from "@server/repositories/contentDocumentRepository";
import { ContentVersionRepository } from "@server/repositories/contentVersionRepository";
import { ILogger, Logger } from "@shared/developmentLogger";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { DocumentEntity } from "@framework/entities/document";
import { DocumentDescriptionMapper, SalesforceDocumentMapper } from "@server/repositories/mappers/documentMapper";
import { DocumentFilter } from "@framework/types/DocumentFilter";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { IFileWrapper } from "@framework/types/fileWapper";

export class DocumentsRepository {
  private readonly logger: Logger = new Logger("DocumentsRepository");
  private readonly contentVersionRepository: ContentVersionRepository;
  private readonly contentDocumentLinkRepository: ContentDocumentLinkRepository;
  private readonly contentDocumentRepository: ContentDocumentRepository;

  public constructor(getSalesforceConnection: () => Promise<Connection>, logger: ILogger) {
    this.contentVersionRepository = new ContentVersionRepository(getSalesforceConnection, logger);
    this.contentDocumentLinkRepository = new ContentDocumentLinkRepository(getSalesforceConnection, logger);
    this.contentDocumentRepository = new ContentDocumentRepository(getSalesforceConnection, logger);
  }

  private async canDeleteDocument(documentId: string): Promise<boolean> {
    const [documentMetaData] = await this.getDocumentsMetadata([documentId]);

    return documentMetaData.isOwner;
  }

  public async insertDocument(
    document: IFileWrapper,
    recordId: string,
    description?: DocumentDescription,
  ): Promise<string> {
    this.logger.debug("Adding files", recordId, description);

    const sfDescription = new DocumentDescriptionMapper().mapToSalesforceDocumentDescription(description);
    const contentVersionId = await this.contentVersionRepository.insertDocument(
      document as ServerFileWrapper,
      sfDescription,
    );
    const contentVersion = await this.contentVersionRepository.getDocument(contentVersionId);
    const documentId = contentVersion.ContentDocumentId;

    await this.contentDocumentLinkRepository.insertContentDocumentLink(documentId, recordId);
    return documentId;
  }

  public async deleteDocument(documentId: string): Promise<void> {
    const canDelete = await this.canDeleteDocument(documentId);

    if (!canDelete) throw Error("NOT_UPLOADED_FROM_OWNER");

    return this.contentDocumentRepository.delete(documentId);
  }

  public async getDocumentsMetadata(documentIds: string[], filter?: DocumentFilter): Promise<DocumentEntity[]> {
    const documents = await this.contentVersionRepository.getDocuments(documentIds, filter);
    const mapper = new SalesforceDocumentMapper();
    return documents.map(x => mapper.map(x));
  }

  public async getDocumentMetadata(versionId: string): Promise<DocumentEntity> {
    const document = await this.contentVersionRepository.getDocument(versionId);
    return new SalesforceDocumentMapper().map(document);
  }

  public async isExistingDocument(documentId: string, recordId: string): Promise<boolean> {
    const documentLink = await this.contentDocumentLinkRepository.get(documentId, recordId);
    return !!documentLink;
  }

  public async getDocumentMetadataForEntityDocument(
    entityId: string,
    versionId: string,
  ): Promise<DocumentEntity | null> {
    // @TODO: try to improve this in terms of numbers of calls
    // however salesforce makes it difficult to do this !!!
    const docIds = await this.contentDocumentLinkRepository
      .getAllForEntity(entityId)
      .then(x => x.map(y => y.ContentDocumentId));
    const versions = await this.contentVersionRepository.getDocuments(docIds);
    const document = versions.find(x => x.Id === versionId) || null;
    return document ? new SalesforceDocumentMapper().map(document) : null;
  }

  public async getDocumentsMetadataByLinkedRecord(
    recordId: string,
    filter?: DocumentFilter,
  ): Promise<DocumentEntity[]> {
    const linkedDocs = await this.contentDocumentLinkRepository.getAllForEntity(recordId);

    if (!linkedDocs || !linkedDocs.length) {
      return [];
    }

    const metadata = await this.getDocumentsMetadata(
      linkedDocs.map(x => x.ContentDocumentId),
      filter,
    );

    // Obtain a list of illegal files
    const chatterFiles = await this.salesforceFeedAttachmentRepository.getAllByRecordIds([
      ...linkedDocs.map(x => x.ContentDocumentId),
      ...metadata.map(x => x.id),
    ]);

    // Remove all the illegal files
    return metadata.filter(x => !chatterFiles.some(y => y.RecordId === x.id || y.RecordId === x.contentDocumentId));
  }

  public async getDocumentContent(versionId: string): Promise<Stream> {
    const contentVersion = await this.contentVersionRepository.getDocument(versionId);
    const chatterFiles = await this.salesforceFeedAttachmentRepository.getAllByRecordIds([
      versionId,
      contentVersion.ContentDocumentId,
    ]);

    // Disallow files that are in chatter from being accessed
    if (chatterFiles.some(x => x.RecordId === versionId || x.RecordId === contentVersion.ContentDocumentId))
      throw new ForbiddenError("You do not have permissions to access this file.");

    return this.contentVersionRepository.getDocumentData(versionId);
  }
}

export type IDocumentsRepository = Pick<
  DocumentsRepository,
  | "insertDocument"
  | "deleteDocument"
  | "isExistingDocument"
  | "getDocumentContent"
  | "getDocumentMetadata"
  | "getDocumentMetadataForEntityDocument"
  | "getDocumentsMetadata"
  | "getDocumentsMetadataByLinkedRecord"
>;
