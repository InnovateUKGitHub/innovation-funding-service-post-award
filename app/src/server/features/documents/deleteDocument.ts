import {ICommand, IContext} from "../common/context";

export class DeleteDocumentCommand implements ICommand<void> {
  constructor(private id: string) {
  }

  public async Run(context: IContext) {
    return context.repositories.contentDocument.delete(this.id);
  }
}
