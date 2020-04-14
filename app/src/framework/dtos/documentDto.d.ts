import { DocumentDescription } from "@framework/constants";

interface IStream {
  pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean; }): T;
}

interface DocumentSummaryDto {
  fileName: string;
  link: string;
  id: string;
  description?: DocumentDescription | null;
  fileSize: number;
  dateCreated: Date;
  uploadedBy: string;
}

interface DocumentDescriptionDto {
  id: DocumentDescription;
  label: string;
}

interface DocumentDto {
  fileName: string;
  fileType: string | null;
  contentLength: number;
  stream: IStream;
}
