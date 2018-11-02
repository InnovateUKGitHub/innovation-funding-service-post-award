import { dataStoreHelper, IDataSelector } from "./common";
import { IContact } from "../../models";

export const contactsStore = "contacts";
export const getContacts = () => dataStoreHelper(contactsStore, "All") as IDataSelector<IContact[]>;

export const contactStore = "contact";
export const getContact = (contactId: string) => dataStoreHelper(contactStore, contactId) as IDataSelector<IContact>;
