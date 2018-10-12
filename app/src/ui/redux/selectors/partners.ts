import {PartnerDto} from "../../models";
import {IDataStore, RootState} from "../reducers";
import {getData} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";

export const partnersStore = "partners";

const getPartners = (state: RootState): { [key: string]: IDataStore<PartnerDto[]> } => (getData(state)[partnersStore] || {});

// selectors

export const findPartnersByProject = (projectId: string): IDataSelector<PartnerDto[]> => {
  const key =  `projectId=${projectId}`;
  const get = (state: RootState) => getPartners(state)[key];
  return {key, get, getPending: state => Pending.create(get(state))};
};
