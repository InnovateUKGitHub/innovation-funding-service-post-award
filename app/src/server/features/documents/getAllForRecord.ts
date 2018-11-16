import {IContext, IQuery} from "../common/context";

export class GetDocumentsLinkedToRecordQuery implements IQuery<DocumentSummaryDto[]> {
  constructor(public recordId: string, public description?: string) {
  }

  public async Run(context: IContext) {
    const linkedDocs = await context.repositories.contentDocumentLinks.getAllForEntity(this.recordId);

    if (!linkedDocs || !linkedDocs.length) {
      return [];
    }

    const filter = this.description ? { description: this.description } : undefined;
    const documents = await context.repositories.contentVersions.getDocuments(linkedDocs.map(x => x.ContentDocumentId), filter);
    return documents.map<DocumentSummaryDto>(doc => ({
      link: `/api/documents/${doc.Id}/content`,
      fileName: doc.FileExtension ? `${doc.Title}.${doc.FileExtension}` : doc.Title,
      id: doc.ContentDocumentId,
      description: doc.Description
    }));
  }
}
