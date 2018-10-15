import {ClaimDetailsSummaryDto} from "../../models";
import {IDataStore, RootState} from "../reducers";
import {getData} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";

export const claimDetailsSummaryStore = "claimDetailsSummary";

const getClaimDetailsSummary = (state: RootState): { [key: string]: IDataStore<ClaimDetailsSummaryDto[]> } => (getData(state)[claimDetailsSummaryStore] || {});

// selectors
export const findClaimDetailsSummaryByPartnerAndPeriod = (partnerId: string, periodId: number): IDataSelector<ClaimDetailsSummaryDto[]> => {
  const key =  `partnerId=${partnerId}&periodId=${periodId}`;
  const get = (state: RootState) => getClaimDetailsSummary(state)[key];
  return { key, get, getPending: (state: RootState) => Pending.create(get(state))};
};
