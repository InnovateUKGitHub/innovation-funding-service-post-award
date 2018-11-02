import { dataStoreHelper } from "./common";

export const contactsStore = "contacts";
export const getContacts = () => dataStoreHelper(contactsStore, "All");

export const contactStore = "contact";
export const getContact = (contactId: string) => dataStoreHelper(contactStore, contactId);
