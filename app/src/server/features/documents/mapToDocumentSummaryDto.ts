import { DocumentSummaryDto, PartnerDocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentEntity } from "@framework/entities/document";
import { Partner } from "@framework/entities/partner";

export const mapToPartnerDocumentSummaryDto = (
  doc: DocumentEntity,
  link: string,
  partner: Partner,
): PartnerDocumentSummaryDto => {
  return {
    partnerId: partner.id,
    partnerName: partner.name,
    ...mapToDocumentSummaryDto(doc, link),
  };
};

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
