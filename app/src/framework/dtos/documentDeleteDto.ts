export interface DocumentDeleteDto {
  // Files are never specified in DocumentDeleteDto.
  // Instead, file to delete is specified with documentId.
  documentId: string;
  files: never[];
  partnerId?: PartnerId;
}
