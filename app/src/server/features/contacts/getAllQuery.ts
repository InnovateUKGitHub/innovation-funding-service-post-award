import { QueryBase } from "../common/queryBase";
import { mapItem } from "./mapItem";
import { IContext } from "../../../types/IContext";

export class GetAllQuery extends QueryBase<IContact[]> {
  async Run(context: IContext) {
    const contacts = await context.repositories.contacts.getAll();
    return contacts.map(y => mapItem(y));
  }
}
