import { IContext } from "@framework/types";
import { QueryBase } from "../common";
import { mapToDocumentSummaryDto } from "./mapToDocumentSummaryDto";
import { dateComparator } from "@framework/util";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentEntity } from "@framework/entities/document";
import { DocumentFilter } from "@framework/types/DocumentFilter";

export abstract class DocumentsSummaryQueryBase extends QueryBase<DocumentSummaryDto[]> {
  constructor(protected readonly filter?: DocumentFilter) {
    super();
  }

  protected async Run(context: IContext): Promise<DocumentSummaryDto[]> {
    const recordId = await this.getRecordId(context);
    if(!recordId) return [];
    const linkedDocs = await context.repositories.documents.getDocumentsMetedataByLinkedRecord(recordId, this.filter);
    return linkedDocs
      .map(x => mapToDocumentSummaryDto(x, this.getUrl(x)))
      .sort((a,b) => dateComparator(a.dateCreated, b.dateCreated) * -1)
      ;
  }

  protected abstract getRecordId(context: IContext): Promise<string|null>;
  protected abstract getUrl(document: DocumentEntity): string;
}
