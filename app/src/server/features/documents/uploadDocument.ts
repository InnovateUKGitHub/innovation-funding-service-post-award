import { FileUpload, IContext } from "@framework/types";
import { CommandBase } from "@server/features/common";

export class UploadDocumentCommand extends CommandBase<string> {
  constructor(private readonly file: FileUpload, private readonly recordId: string) {
    super();
  }

  protected async Run(context: IContext) {
    return context.repositories.documents.insertDocument(this.file, this.recordId);
  }
}
