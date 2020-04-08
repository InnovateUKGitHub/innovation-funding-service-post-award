import { DocumentDescription } from "@framework/constants";

export interface DocumentUploadDto {
  file: IFileWrapper | null;
  description?: DocumentDescription;
}

export interface MultipleDocumentUploadDto {
  files: IFileWrapper[];
  description?: DocumentDescription;
}
