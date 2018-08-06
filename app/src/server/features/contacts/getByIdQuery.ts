import { IContext, IQuery } from "../common/context";
import { IContact } from "../../../models";
import { mapItem } from "./mapItem";

export class GetByIdQuery implements IQuery<IContact> {
  constructor(readonly id: string) {}

  async Run(context: IContext) {
    const item = await context.repositories.contacts.getById(this.id);
    return mapItem(item);
  }
}
