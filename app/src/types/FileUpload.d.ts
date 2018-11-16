import { DocumentDescription } from "./constants/documentDescription";

export interface FileUpload {
  content: string;
  fileName: string;
  description: DocumentDescription;
}
