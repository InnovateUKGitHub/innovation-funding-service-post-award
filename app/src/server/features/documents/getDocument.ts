import { QueryBase } from "../common";
import { IContext } from "../../../types";

export class GetDocumentQuery extends QueryBase<DocumentDto> {
  constructor(private readonly documentId: string) {
    super();
  }

  protected async Run(context: IContext) {
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
