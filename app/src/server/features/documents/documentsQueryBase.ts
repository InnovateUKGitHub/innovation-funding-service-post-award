import { IContext } from "@framework/types";
import { QueryBase } from "../common";
import { mapToDocumentSummaryDto } from "./mapToDocumentSummaryDto";
import { ISalesforceDocument } from "@server/repositories";

export abstract class DocumentsQueryBase extends QueryBase<DocumentSummaryDto[]> {
  constructor(protected readonly filter?: DocumentFilter) {
    super();
  }

  protected async Run(context: IContext): Promise<DocumentSummaryDto[]> {
    const recordId = await this.getRecordId(context);
    if(!recordId) return [];
    const linkedDocs = await context.repositories.documents.getDocumentsMetedataByLinkedRecord(recordId, this.filter);
    return linkedDocs.map(x => mapToDocumentSummaryDto(x, this.getUrl(x)));
  }

  protected abstract getRecordId(context: IContext): Promise<string|null>;
  protected abstract getUrl(document: ISalesforceDocument): string;
}
