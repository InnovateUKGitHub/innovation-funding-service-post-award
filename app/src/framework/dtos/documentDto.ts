/* global NodeJS */
import { DocumentDescription } from "@framework/constants";

interface IStream {
  pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean }): T;
}

export type AllPartnerDocumentSummaryDto = PartnerDocumentSummaryDto[];
export interface PartnerDocumentSummaryDto extends DocumentSummaryDto {
  partnerId: string;
  partnerName: string;
}

export interface DocumentSummaryDto {
  fileName: string;
  link: string;
  id: string;
  description?: DocumentDescription | null;
  fileSize: number;
  dateCreated: Date;
  uploadedBy: string;
  isOwner: boolean;
}

export interface DocumentDescriptionDto {
  id: DocumentDescription;
  label: string;
}

export interface DocumentDto {
  fileName: string;
  fileType: string | null;
  contentLength: number;
  stream: IStream;
}
