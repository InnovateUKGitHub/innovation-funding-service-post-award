import {PartnerDto} from "../../models";
import {IDataStore, RootState} from "../reducers";
import {getData} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";

export const partnerStore = "partner";

const getPartnersCollection = (state: RootState): { [key: string]: IDataStore<PartnerDto> } => (getData(state)[partnerStore] || {});

// selectors
export const getPartner = (id: string): IDataSelector<PartnerDto> => {
  const get = (state: RootState) => getPartnersCollection(state)[id];
  return { key: id, get, getPending: state => Pending.create(get(state)) };
};
