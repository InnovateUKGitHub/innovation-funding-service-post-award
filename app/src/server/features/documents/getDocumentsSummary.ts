import { IContext } from "@framework/types";
import { QueryBase } from "@server/features/common";
import { mapToDocumentSummaryDto } from "@server/features/documents/mapToDocumentSummaryDto";

export class GetDocumentsSummaryQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(private readonly documentIds: string[], private readonly filter?: DocumentFilter) {
    super();
  }

  protected async Run(context: IContext) {
    const documents = await context.repositories.documents.getDocumentsMetadata(this.documentIds, this.filter);
    return documents.map<DocumentSummaryDto>(x => mapToDocumentSummaryDto(x));
  }
}
