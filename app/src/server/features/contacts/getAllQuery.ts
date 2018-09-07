import { IContact } from "../../../ui/models";
import { mapItem } from "./mapItem";
import { IContext, IQuery } from "../common/context";

export class GetAllQuery implements IQuery<IContact[]> {
  async Run(context: IContext) {
    const contacts = await context.repositories.contacts.getAll();
    return contacts.map(y => mapItem(y));
  }
}
