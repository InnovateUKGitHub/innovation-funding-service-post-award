import { IContext, QueryBase } from "../common/context";
import { mapItem } from "./mapItem";

export class GetByIdQuery extends QueryBase<IContact|null> {
  constructor(readonly id: string) {
    super();
  }

  async Run(context: IContext) {
    const item = await context.repositories.contacts.getById(this.id);
    return item && mapItem(item);
  }
}
