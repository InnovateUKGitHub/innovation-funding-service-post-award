import {IContact} from "../../models";
import {IDataStore, RootState} from "../reducers";
import {getData} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";

export const contactsStore = "contacts";

const getContactsCollection = (state: RootState): { [key: string]: IDataStore<IContact[]> } => (getData(state)[contactsStore] || {});

// selectors
export const getContacts = (): IDataSelector<IContact[]> => {
  const get = (state: RootState) => getContactsCollection(state).All;
  return { key: "All", get, getPending: (state: RootState) => Pending.create(get(state)) };
};
