import { conditionalLoad, createLoadAction } from "./dataLoad";

export function loadContacts() {
  return conditionalLoad(
    (state) => state.data.contacts.all,
    createLoadAction("all", "contacts"),
    () => fetch("http://localhost:8080/api/contacts") as any
  );
}

export function loadContact(id: number) {
  return conditionalLoad(
    (state) => state.data.contacts[id],
    createLoadAction(id, "contacts"),
    () => fetch(`http://localhost:8080/api/contact/${id}`) as any
  );
}

// export function updateContact() {

// }
