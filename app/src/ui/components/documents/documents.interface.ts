import { DocumentSummaryDto } from "@framework/dtos";

export interface DocumentsBase<T = DocumentSummaryDto> {
  documents: T[];
  qa: string;
}
