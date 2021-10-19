import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentEntity } from "@framework/entities/document";

export const mapToDocumentSummaryDto = (doc: DocumentEntity, link: string): DocumentSummaryDto => {
  const fileName = doc.fileExtension ? `${doc.title}.${doc.fileExtension}` : doc.title;

  return {
    link,
    fileName,
    id: doc.contentDocumentId,
    description: doc.description,
    fileSize: doc.contentSize,
    dateCreated: doc.createdDate,
    uploadedBy: doc.lastModifiedBy,
    isOwner: doc.isOwner,
  };
};
