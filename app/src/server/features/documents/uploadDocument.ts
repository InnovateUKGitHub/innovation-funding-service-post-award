import { CommandBase } from "../common";
import { FileUpload, IContext } from "../../../types";

export class UploadDocumentCommand extends CommandBase<string> {
  constructor(private readonly file: FileUpload, private readonly recordId: string) {
    super();
  }

  protected async Run(context: IContext) {
    const contentVersionId = await context.repositories.contentVersions.insertDocument(this.file);
    const contentVersion = await context.repositories.contentVersions.getDocument(contentVersionId);
    const documentId = contentVersion.ContentDocumentId;
    await context.repositories.contentDocumentLinks.insertContentDocumentLink(documentId, this.recordId);
    return contentVersion.Id;
  }
}
