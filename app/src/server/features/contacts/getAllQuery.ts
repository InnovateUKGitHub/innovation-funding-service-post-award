import { IContext, QueryBase } from "../common/context";
import { mapItem } from "./mapItem";

export class GetAllQuery extends QueryBase<IContact[]> {
  async Run(context: IContext) {
    const contacts = await context.repositories.contacts.getAll();
    return contacts.map(y => mapItem(y));
  }
}
