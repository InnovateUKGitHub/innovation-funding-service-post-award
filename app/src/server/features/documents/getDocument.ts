import {IContext, IQuery} from "../common/context";
import {DocumentDto} from "../../../ui/models";

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
      fileName: `${document.Title}.${document.FileExtension}`
    };
  }
}
