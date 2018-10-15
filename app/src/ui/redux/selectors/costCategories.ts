import {CostCategoryDto} from "../../models";
import {IDataStore, RootState} from "../reducers";
import {getData} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";

export const costCategoriesStore = "costCategories";

const getCostCategoriesCollection = (state: RootState): { [key: string]: IDataStore<CostCategoryDto[]> } => (getData(state)[costCategoriesStore] || {});

// selectors
export const getCostCategories = (): IDataSelector<CostCategoryDto[]> => {
  const key =  "All";
  const get = (state: RootState) => getCostCategoriesCollection(state).All;
  return { key, get, getPending: (state: RootState) => Pending.create(get(state))};
};
