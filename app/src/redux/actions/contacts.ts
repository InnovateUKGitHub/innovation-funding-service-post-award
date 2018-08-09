import { conditionalLoad } from "./dataLoad";
import { Api } from "../../api";
import { RootState } from "../reducers";

export function loadContacts() {
  return conditionalLoad(
    () => "all",
    () => "contacts",
    (state) => state.data.contacts.all,
    () => Api.contacts.getAll() as any
  );
}

export function loadContact(id: any) {
  return conditionalLoad(
    (state) => !!state.router.route ? state.router.route.params.id : null,
    () => "contacts",
    (state) => state.data.contacts[id],
    () => Api.contacts.get(id)
  );
}

// export function updateContact() {

// }
