import { QueryBase } from "../common";
import { GetDocumentsSummaryQuery } from "./getDocumentsSummary";
import { IContext } from "../../../types";

export class GetDocumentsLinkedToRecordQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(private readonly recordId: string, private readonly filter?: DocumentFilter) {
    super();
  }

  protected async Run(context: IContext) {
    const linkedDocs = await context.repositories.contentDocumentLinks.getAllForEntity(this.recordId);

    if (!linkedDocs || !linkedDocs.length) {
      return [];
    }

    return context.runQuery(new GetDocumentsSummaryQuery(linkedDocs.map(x => x.ContentDocumentId), this.filter));
  }
}
