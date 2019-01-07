import {IContext, QueryBase} from "../common/context";
import { GetDocumentsSummaryQuery } from "./getDocumentsSummary";

export class GetDocumentsLinkedToRecordQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(public recordId: string, public filter?: DocumentFilter) {
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
