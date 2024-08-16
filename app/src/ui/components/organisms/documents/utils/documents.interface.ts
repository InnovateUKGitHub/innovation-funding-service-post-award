import { DocumentSummaryDto } from "@framework/dtos/documentDto";

export interface DocumentsBase<T = DocumentSummaryDto> {
  documents: T[];
  qa: string;
}
