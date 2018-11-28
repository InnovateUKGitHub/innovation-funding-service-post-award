import {CommandBase, IContext} from "../common/context";

export class DeleteDocumentCommand extends CommandBase<void> {
  constructor(private id: string) {
    super();
  }

  protected async Run(context: IContext) {
    return context.repositories.contentDocument.delete(this.id);
  }
}
