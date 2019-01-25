import { QueryBase } from "../common/queryBase";
import { mapItem } from "./mapItem";
import { IContext } from "../../../types/IContext";

export class GetByIdQuery extends QueryBase<IContact|null> {
  constructor(readonly id: string) {
    super();
  }

  async Run(context: IContext) {
    const item = await context.repositories.contacts.getById(this.id);
    return item && mapItem(item);
  }
}
