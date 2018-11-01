import { conditionalLoad } from "./common";
import { ApiClient } from "../../apiClient";
import { getContact, getContacts } from "../selectors";

export function loadContacts() {
  const selector = getContacts();
  return conditionalLoad(selector.key, selector.store, params => ApiClient.contacts.getAll(params));
}

export function loadContact(id: string) {
  const selector = getContact(id);
  return conditionalLoad(selector.key, selector.store, params => ApiClient.contacts.get({id, ...params}));
}
