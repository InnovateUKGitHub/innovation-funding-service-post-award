import {IContext, QueryBase} from "../common/context";

export class GetDocumentsSummaryQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(public documentIds: string[], public filter?: DocumentFilter) {
    super();
  }

  protected async Run(context: IContext) {
    const documents = await context.repositories.contentVersions.getDocuments(this.documentIds, this.filter);
    return documents.map<DocumentSummaryDto>(doc => ({
      link: `/api/documents/${doc.Id}/content`,
      fileName: doc.FileExtension ? `${doc.Title}.${doc.FileExtension}` : doc.Title,
      id: doc.ContentDocumentId,
      description: doc.Description
    }));
  }
}
