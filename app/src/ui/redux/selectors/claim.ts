import {ClaimDto} from "../../models";
import {IDataStore, RootState} from "../reducers";
import {getData} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";

export const claimStore = "claim";

const getClaims = (state: RootState): { [key: string]: IDataStore<ClaimDto> } => (getData(state)[claimStore] || {});

// selectors
export const getClaim = (partnerId: string, periodId: number): IDataSelector<ClaimDto> => {
  const key = `${partnerId}_${periodId}`;
  const get = (state: RootState) => getClaims(state)[key];
  return { key, get, getPending: (state: RootState) => (Pending.create(get(state))) };
};
