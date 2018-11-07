import {ICommand, IContext} from "../common/context";

export class DeleteDocumentCommand implements ICommand<string> {
  constructor(private id: string) {
  }

  public async Run(context: IContext) {
    const contentVersionId = await context.repositories.contentVersions.insertDocument(this.content, this.fileName);
    const contentVersion = await context.repositories.contentVersions.getDocument(contentVersionId);
    const documentId = contentVersion.ContentDocumentId;
    return context.repositories.contentDocumentLinks.insertContentDocumentLink(documentId, this.recordId);
  }
}
