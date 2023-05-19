import { DocumentDescription } from "@framework/constants";
import { IFileWrapper } from "@framework/types";
import multer from "multer";

export interface DocumentUploadDto {
  description?: DocumentDescription;
  file: IFileWrapper | null;
}

export interface MultipleDocumentUploadDto {
  description?: DocumentDescription;
  files: IFileWrapper[];
  partnerId?: PartnerId;
  multerError?: multer.ErrorCode;
}
