import { conditionalLoad } from "./dataLoad";
import { ApiClient } from "../../shared/apiClient";
import { RootState } from "../reducers";
import { IContact } from "../../models";

export function loadContacts() {
  return conditionalLoad(
    () => "all",
    () => "contacts",
    () => ApiClient.contacts.getAll()
  );
}

export function loadContact(id: any) {
  return conditionalLoad(
    (state) => !!state.router.route ? state.router.route.params.id : null,
    () => "contacts",
    () => ApiClient.contacts.get(id)
  );
}
