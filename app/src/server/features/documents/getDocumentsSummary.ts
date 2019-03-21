import { QueryBase } from "../common";
import { IContext } from "../../../types";

export class GetDocumentsSummaryQuery extends QueryBase<DocumentSummaryDto[]> {
  constructor(private readonly documentIds: string[], private readonly filter?: DocumentFilter) {
    super();
  }

  protected async Run(context: IContext) {
    const documents = await context.repositories.contentVersions.getDocuments(this.documentIds, this.filter);
    return documents.map<DocumentSummaryDto>(doc => ({
      link: `/api/documents/${doc.Id}/content`,
      fileName: doc.FileExtension ? `${doc.Title}.${doc.FileExtension}` : doc.Title,
      id: doc.ContentDocumentId,
      description: doc.Description,
      fileSize: doc.ContentSize,
      dateCreated: doc.CreatedDate,
      owner: doc.Owner.Username
    }));
  }
}
