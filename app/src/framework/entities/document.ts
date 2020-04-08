import { DocumentDescription } from "@framework/constants";

export interface DocumentEntity {
  id: string;
  title: string;
  fileExtension: string | null;
  contentDocumentId: string;
  contentSize: number;
  fileType: string | null;
  reasonForChange: string;
  pathOnClient: string;
  contentLocation: string;
  versionData: string;
  description: DocumentDescription | null;
  createdDate: Date;
  lastModifiedBy: string;
}
