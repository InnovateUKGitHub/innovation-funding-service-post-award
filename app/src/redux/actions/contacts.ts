import { conditionalLoad } from "./dataLoad";
import { Api } from "../../api";
import { RootState } from "../reducers";
import { IContact } from "../../models";

export function loadContacts() {
  return conditionalLoad(
    () => "all",
    () => "contacts",
    () => Api.contacts.getAll()
  );
}

export function loadContact(id: any) {
  return conditionalLoad(
    (state) => !!state.router.route ? state.router.route.params.id : null,
    () => "contacts",
    () => Api.contacts.get(id)
  );
}
