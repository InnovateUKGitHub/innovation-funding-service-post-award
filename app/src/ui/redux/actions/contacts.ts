import {conditionalLoad} from "./dataLoad";
import { ApiClient } from "../../apiClient";
import { contactsStore, getContacts } from "../selectors/contacts";

export function loadContacts() {
  return conditionalLoad(
    getContacts().key,
    contactsStore,
    (params) => ApiClient.contacts.getAll(params)
  );
}
