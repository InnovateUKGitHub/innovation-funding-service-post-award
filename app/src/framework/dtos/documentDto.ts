import { DocumentDescription } from "@framework/constants/documentDescription";
import type { Writable } from "node:stream";

export type AllPartnerDocumentSummaryDto = PartnerDocumentSummaryDto[];
export interface PartnerDocumentSummaryDto extends DocumentSummaryDto {
  partnerId: PartnerId;
  partnerName: string;
}

export interface PartnerDocumentSummaryDtoGql extends PartnerDocumentSummaryDto {
  linkedEntityId: LinkedEntityId;
}

export interface DocumentSummaryDto {
  dateCreated: Date;
  description?: DocumentDescription | null;
  fileName: string;
  fileSize: number;
  id: string;
  isOwner: boolean;
  link: string;
  uploadedBy: string;
}

export interface DocumentDescriptionDto {
  id: DocumentDescription;
  label: string;
}

export interface DocumentDto {
  contentLength: number;
  fileName: string;
  fileType: string | null;
  stream: Writable | null;
}
