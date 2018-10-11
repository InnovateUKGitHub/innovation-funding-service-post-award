import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { contactStore, getContact } from "../selectors/contact";

export function loadContact(id: string) {
  return conditionalLoad(
    getContact(id).key,
    contactStore,
    () => ApiClient.contacts.get(id)
  );
}
