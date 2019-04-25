import { CommandBase } from "@server/features/common";
import { IContext } from "@framework/types";

export class DeleteDocumentCommand extends CommandBase<void> {
  constructor(private readonly documentId: string) {
    super();
  }

  protected async Run(context: IContext) {
    return context.repositories.documents.deleteDocument(this.documentId);
  }
}
