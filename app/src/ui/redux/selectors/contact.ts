import {IContact} from "../../models";
import {IDataStore, RootState} from "../reducers";
import {getData} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";

export const contactStore = "contact";

const getContacts = (state: RootState): { [key: string]: IDataStore<IContact> } => (getData(state)[contactStore] || {});

// selectors
export const getContact = (id: string): IDataSelector<IContact> => {
  const get = (state: RootState) => getContacts(state)[id];
  return { key: id, get, getPending: (state: RootState) => (Pending.create(get(state))) };
};
