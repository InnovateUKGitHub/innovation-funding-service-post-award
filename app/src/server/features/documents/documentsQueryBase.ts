import { IContext } from "@framework/types";
import { QueryBase } from "../common";
import { mapToDocumentSummaryDto } from "./mapToDocumentSummaryDto";
import { ISalesforceDocument } from "@server/repositories";

export abstract class DocumentsQueryBase extends QueryBase<DocumentSummaryDto[]> {
  constructor() {
    super();
  }

  protected async getDocumentsForEntityId(context: IContext, recordId: string, filter?: DocumentFilter) {
    const linkedDocs = await context.repositories.documents.getDocumentsMetedataByLinkedRecord(recordId, filter);
    return linkedDocs.map(x => mapToDocumentSummaryDto(x, this.getUrl(x)));
  }

  abstract getUrl(document: ISalesforceDocument): string;
}
