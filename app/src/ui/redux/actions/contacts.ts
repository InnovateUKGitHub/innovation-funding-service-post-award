import { ApiClient } from "../../apiClient";
import { conditionalLoad } from "./common";
import { getContact, getContacts } from "../selectors";

export function loadContacts() {
  return conditionalLoad(getContacts(), params => ApiClient.contacts.getAll(params));
}

export function loadContact(id: string) {
  return conditionalLoad(getContact(id), params => ApiClient.contacts.get({id, ...params}));
}
