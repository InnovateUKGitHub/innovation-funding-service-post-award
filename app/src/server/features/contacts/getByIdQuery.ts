import { QueryBase } from "../common";
import { IContext } from "../../../types";
import { mapItem } from "./mapItem";

export class GetByIdQuery extends QueryBase<IContact|null> {
  constructor(private readonly id: string) {
    super();
  }

  async Run(context: IContext) {
    const item = await context.repositories.contacts.getById(this.id);
    return item && mapItem(item);
  }
}
