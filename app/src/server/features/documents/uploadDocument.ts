import {ICommand, IContext} from "../common/context";

export class UploadDocumentCommand implements ICommand<string> {
  constructor(private file: FileUpload, private recordId: string) {
  }

  public async Run(context: IContext) {
    const contentVersionId = await context.repositories.contentVersions.insertDocument(this.file);
    const contentVersion = await context.repositories.contentVersions.getDocument(contentVersionId);
    const documentId = contentVersion.ContentDocumentId;
    return context.repositories.contentDocumentLinks.insertContentDocumentLink(documentId, this.recordId);
  }
}
