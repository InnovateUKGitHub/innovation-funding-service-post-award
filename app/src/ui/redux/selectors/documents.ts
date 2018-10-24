import {DocumentSummaryDto} from "../../models";
import {RootState} from "../reducers";
import {getDataStoreItem} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";

export const documentStore = "documents";

// selectors
export const getClaimDetailDocuments = (partnerId: string, periodId: number, costCategoryId: string): IDataSelector<DocumentSummaryDto[]> => {
  const key =  `claim_detail_${partnerId}_${periodId}_${costCategoryId}`;
  const get = (state: RootState) => getDataStoreItem(state, documentStore, key);
  return { key, get, getPending: (state: RootState) => Pending.create(get(state))};
};
