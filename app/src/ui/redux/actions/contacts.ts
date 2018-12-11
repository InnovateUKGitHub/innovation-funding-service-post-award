import { ApiClient } from "../../apiClient";
import { conditionalLoad } from "./common";
import { getContact, getContacts } from "../selectors";

export function loadContacts() {
  return conditionalLoad(getContacts(), params => ApiClient.contacts.getAll(params));
}

export function loadContact(contactId: string) {
  return conditionalLoad(getContact(contactId), params => ApiClient.contacts.get({ contactId, ...params}));
}
