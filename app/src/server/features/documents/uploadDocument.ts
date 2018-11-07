import {ICommand, IContext} from "../common/context";

export class UploadDocumentCommand implements ICommand<string> {
  constructor(private content: string, private fileName: string, private recordId: string) {
  }

  public async Run(context: IContext) {
    const contentVersionId = await context.repositories.contentVersions.insertDocument(this.content, this.fileName);
    const contentVersion = await context.repositories.contentVersions.getDocument(contentVersionId);
    const documentId = contentVersion.ContentDocumentId;
    await context.repositories.contentDocumentLinks.insertContentDocumentLink(documentId, this.recordId);
    return contentVersion.Id;
  }
}
