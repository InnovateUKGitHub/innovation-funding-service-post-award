import {CommandBase} from "../common/commandBase";
import { IContext } from "../../../types/IContext";

export class DeleteDocumentCommand extends CommandBase<void> {
  constructor(private id: string) {
    super();
  }

  protected async Run(context: IContext) {
    return context.repositories.contentDocument.delete(this.id);
  }
}
