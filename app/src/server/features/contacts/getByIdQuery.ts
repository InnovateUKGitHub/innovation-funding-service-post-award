import { IContext, IQuery } from "../common/context";
import { IContact } from "../../../ui/models";
import { mapItem } from "./mapItem";

export class GetByIdQuery implements IQuery<IContact|null> {
  constructor(readonly id: string) {}

  async Run(context: IContext) {
    const item = await context.repositories.contacts.getById(this.id);
    return item && mapItem(item);
  }
}
