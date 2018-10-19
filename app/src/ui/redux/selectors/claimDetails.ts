import {ClaimDetailsDto} from "../../models";
import {IDataStore, RootState} from "../reducers";
import {getData} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";

export const claimDetailsStore = "claimDetails";

const getClaimDetails = (state: RootState): { [key: string]: IDataStore<ClaimDetailsDto[]> } => (getData(state)[claimDetailsStore] || {});

// selectors
export const findClaimDetailsByPartner = (partnerId: string): IDataSelector<ClaimDetailsDto[]> => {
  const key =  `partnerId=${partnerId}`;
  const get = (state: RootState) => getClaimDetails(state)[key];
  return { key, get, getPending: (state: RootState) => Pending.create(get(state))};
};
