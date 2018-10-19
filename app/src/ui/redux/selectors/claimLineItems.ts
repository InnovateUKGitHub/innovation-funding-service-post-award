import {ClaimLineItemDto} from "../../models";
import {IDataStore, RootState} from "../reducers";
import {getData} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";

export const claimLineItemsStore = "claimLineItems";

const getClaimLineItems = (state: RootState): { [key: string]: IDataStore<ClaimLineItemDto[]> } => (getData(state)[claimLineItemsStore] || {});

// selectors
export const findClaimLineItemsByPartnerCostCategoryAndPeriod = (partnerId: string, costCategoryId: string, periodId: number): IDataSelector<ClaimLineItemDto[]> => {
  const key =  `partnerId=${partnerId}&costCategoryId=${costCategoryId}&periodId=${periodId}`;
  const get = (state: RootState) => getClaimLineItems(state)[key];
  return { key, get, getPending: (state: RootState) => Pending.create(get(state))};
};
