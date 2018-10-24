import {IContext, IQuery} from "../common/context";
import {DocumentSummaryDto} from "../../../ui/models";

export class GetDocumentsLinkedToRecordQuery implements IQuery<DocumentSummaryDto[]> {
  constructor(public recordId: string) {
  }

  public async Run(context: IContext) {
    const linkedDocs = await context.repositories.contentDocumentLinks.getAllForEntity(this.recordId);

    if (!linkedDocs || !linkedDocs.length) {
      return [];
    }

    const documents = await context.repositories.contentVersions.getDocuments(linkedDocs.map(x => x.ContentDocumentId));
    return documents.map<DocumentSummaryDto>(doc => ({
      link: `/api/documents/${doc.Id}/content`,
      fileName: `${doc.Title}.${doc.FileExtension}`
    }));
  }
}
