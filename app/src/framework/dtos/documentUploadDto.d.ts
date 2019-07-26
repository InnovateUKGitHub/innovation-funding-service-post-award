interface DocumentUploadDto {
  file: IFileWrapper | null;
  description?: string;
}

interface MultipleDocumentUploadDto {
  files: IFileWrapper[];
  description?: string;
}