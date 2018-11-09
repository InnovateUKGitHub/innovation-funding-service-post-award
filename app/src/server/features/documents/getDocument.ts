import {IContext, IQuery} from "../common/context";

export class GetDocumentQuery implements IQuery<DocumentDto> {
  constructor(private documentId: string) {
  }

  public async Run(context: IContext) {
    const document = await context.repositories.contentVersions.getDocument(this.documentId);
    const documentStream = await context.repositories.contentVersions.getDocumentData(this.documentId);
    return {
      fileType: document.FileType,
      contentLength: document.ContentSize,
      stream: documentStream,
      fileName: document.FileExtension ? `${document.Title}.${document.FileExtension}` : document.Title
    };
  }
}
