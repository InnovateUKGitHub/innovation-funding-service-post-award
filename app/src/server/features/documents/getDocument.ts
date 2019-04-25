import { QueryBase } from "@server/features/common";
import { IContext } from "@framework/types";

export class GetDocumentQuery extends QueryBase<DocumentDto> {
  constructor(private readonly documentId: string) {
    super();
  }

  protected async Run(context: IContext) {
    const document = await context.repositories.documents.getDocumentMetadata(this.documentId);
    const documentStream = await context.repositories.documents.getDocumentContent(this.documentId);
    return {
      fileType: document.FileType,
      contentLength: document.ContentSize,
      stream: documentStream,
      fileName: document.FileExtension ? `${document.Title}.${document.FileExtension}` : document.Title
    };
  }
}
