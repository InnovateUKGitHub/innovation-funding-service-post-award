import {IContext, IQuery} from "../common/context";
import {DocumentDto} from "../../../ui/models";

export class GetDocumentsLinkedToRecordQuery implements IQuery<DocumentDto[]> {
  constructor(public recordId: string) {
  }

  public async Run(context: IContext) {
    const linkedDocs = await context.repositories.contentDocumentLinks.getAllForEntity(this.recordId);

    if (!linkedDocs || !linkedDocs.length) {
      return [];
    }

    const documents = await context.repositories.contentVersions.getDocuments(linkedDocs.map(x => x.ContentDocumentId));
    return documents.map<DocumentDto>(doc => ({
      link: `/api/documents/${doc.Id}`,
      title: `${doc.Title}.${doc.FileExtension}`
    }));
  }
}
