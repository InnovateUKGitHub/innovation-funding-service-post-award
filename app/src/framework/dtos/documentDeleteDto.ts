export interface DocumentDeleteDto {
  // Files are never specified in DocumentDeleteDto.
  // Instead, file to delete is specified with documentId.
  files: never[];
  documentId: string;
  partnerId?: string;
}
