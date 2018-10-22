import {DocumentDto} from "../../models";
import {IDataStore, RootState} from "../reducers";
import {getData} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";

export const documentStore = "documents";

const getDocumentsCollection = (state: RootState): { [key: string]: IDataStore<DocumentDto[]> } => (getData(state)[documentStore] || {});

// selectors
export const getDocuments = (entityId: string): IDataSelector<DocumentDto[]> => {
  const key =  entityId;
  const get = (state: RootState) => getDocumentsCollection(state)[key];
  return { key, get, getPending: (state: RootState) => Pending.create(get(state))};
};
