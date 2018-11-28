import { CommandBase, IContext} from "../common/context";
import { FileUpload } from "../../../types/FileUpload";

export class UploadDocumentCommand extends CommandBase<string> {
  constructor(private file: FileUpload, private recordId: string) {
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
