import {IContext, QueryBase} from "../common/context";

export class GetDocumentsLinkedToRecordQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(public recordId: string, public filter?: DocumentFilter) {
    super();
  }

  protected async Run(context: IContext) {
    const linkedDocs = await context.repositories.contentDocumentLinks.getAllForEntity(this.recordId);

    if (!linkedDocs || !linkedDocs.length) {
      return [];
    }

    const documents = await context.repositories.contentVersions.getDocuments(linkedDocs.map(x => x.ContentDocumentId), this.filter);
    return documents.map<DocumentSummaryDto>(doc => ({
      link: `/api/documents/${doc.Id}/content`,
      fileName: doc.FileExtension ? `${doc.Title}.${doc.FileExtension}` : doc.Title,
      id: doc.ContentDocumentId,
      description: doc.Description
    }));
  }
}
