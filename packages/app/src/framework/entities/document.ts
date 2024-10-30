import { DocumentDescription } from "@framework/constants/documentDescription";

export interface DocumentEntity {
  contentDocumentId: string;
  contentLocation: string;
  contentSize: number;
  createdDate: Date;
  description: DocumentDescription | null;
  fileExtension: string | null;
  fileType: string | null;
  id: string;
  isOwner: boolean;
  lastModifiedBy: string;
  pathOnClient: string;
  reasonForChange: string;
  title: string;
  versionData: string;
}
