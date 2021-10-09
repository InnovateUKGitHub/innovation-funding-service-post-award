import { DocumentSummaryDto } from "@framework/dtos";

export interface DocumentsBase {
  documents: DocumentSummaryDto[];
  qa: string;
}
