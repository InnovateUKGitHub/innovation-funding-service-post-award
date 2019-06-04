import { QueryBase } from "@server/features/common";
import { IContext } from "@framework/types";
import { mapToDocumentSummaryDto } from "@server/features/documents/mapToDocumentSummaryDto";

export class GetDocumentsLinkedToRecordQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(private readonly recordId: string, private readonly filter?: DocumentFilter) {
    super();
  }

  protected async Run(context: IContext) {
    const linkedDocs = await context.repositories.documents.getDocumentsMetedataByLinkedRecord(this.recordId, this.filter);
    return linkedDocs.map(x => mapToDocumentSummaryDto(x));
  }
}
