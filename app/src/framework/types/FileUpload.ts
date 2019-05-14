import { DocumentDescription } from "@framework/constants/documentDescription";

export interface FileUpload {
  content: string;
  fileName: string;
  description?: DocumentDescription;
}
