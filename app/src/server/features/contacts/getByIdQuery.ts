import { IQuery, IContext } from "../common/context";
import { mapItem } from "./mapItem";
import { Contact } from "../../../models";

export class GetByIdQuery implements IQuery<Contact> {
  constructor(public readonly id: string) {}

  public async Run(context: IContext){
      let item = (await context.repositories.contacts.getById(this.id));
      return mapItem(item);
  }
}
