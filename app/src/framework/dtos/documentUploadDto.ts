import { DocumentDescription } from "@framework/constants";
import { IFileWrapper } from "@framework/types";

export interface DocumentUploadDto {
  description?: DocumentDescription;
  file: IFileWrapper | null;
}

export interface MultipleDocumentUploadDto {
  description?: DocumentDescription;
  files: IFileWrapper[];
  partnerId?: PartnerId;
}
