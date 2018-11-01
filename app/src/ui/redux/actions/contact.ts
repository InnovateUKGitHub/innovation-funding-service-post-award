import {conditionalLoad} from "./dataLoad";
import { ApiClient } from "../../apiClient";
import { contactStore, getContact } from "../selectors/contact";

export function loadContact(id: string) {
  return conditionalLoad(
    getContact(id).key,
    contactStore,
    (params) => ApiClient.contacts.get({id, ...params})
  );
}
