import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { contactsStore, getContacts } from "../selectors/contacts";

export function loadContacts() {
  return conditionalLoad(
    getContacts().key,
    contactsStore,
    () => ApiClient.contacts.getAll()
  );
}
