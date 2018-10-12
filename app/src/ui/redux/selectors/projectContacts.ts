import {ProjectContactDto} from "../../models";
import {IDataStore, RootState} from "../reducers";
import {getData} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";

export const projectContactsStore = "projectContacts";

const getContacts = (state: RootState): { [key: string]: IDataStore<ProjectContactDto[]> } => (getData(state)[projectContactsStore] || {});

// selectors
export const findContactsByProject = (projectId: string): IDataSelector<ProjectContactDto[]> => {
  const key = `projectId=${projectId}`;
  const get = (state: RootState) => getContacts(state)[key];
  return {key, get, getPending: state => Pending.create(get(state))};
};
