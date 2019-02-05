import { CommandBase } from "../common";
import { IContext } from "../../../types";

export class DeleteDocumentCommand extends CommandBase<void> {
  constructor(private readonly id: string) {
    super();
  }

  protected async Run(context: IContext) {
    return context.repositories.contentDocument.delete(this.id);
  }
}
