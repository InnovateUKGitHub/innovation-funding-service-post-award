import { DocumentDescription } from "@framework/constants";
import { IFileWrapper } from "@framework/types";

export interface DocumentUploadDto {
  file: IFileWrapper | null;
  description?: DocumentDescription;
}

export interface MultipleDocumentUploadDto {
  files: IFileWrapper[];
  description?: DocumentDescription;
}
