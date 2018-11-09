import { IContext, IQuery } from "../common/context";
import { mapItem } from "./mapItem";

export class GetAllQuery implements IQuery<IContact[]> {
  async Run(context: IContext) {
    const contacts = await context.repositories.contacts.getAll();
    return contacts.map(y => mapItem(y));
  }
}
