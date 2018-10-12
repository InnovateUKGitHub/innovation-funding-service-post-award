import {ClaimDto} from "../../models";
import {IDataStore, RootState} from "../reducers";
import {getData} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";

export const claimsStore = "claims";

const getClaims = (state: RootState): { [key: string]: IDataStore<ClaimDto[]> } => (getData(state)[claimsStore] || {});

// selectors
export const findClaimsByPartner = (partnerId: string): IDataSelector<ClaimDto[]> => {
  const key =  `partnerId=${partnerId}`;
  const get = (state: RootState) => getClaims(state)[key];
  return { key, get, getPending: (state: RootState) => Pending.create(get(state))};
};
