import { IQuery, IContext } from '../common/context'
import { Contact } from '../../../models';
import { mapItem } from "./mapItem";

export class GetAllQuery implements IQuery<Contact[]> {
  public async Run(context: IContext) {
    const contacts = await context.repositories.contacts.getAll();
    return contacts.map(y => mapItem(y));
  }
}
