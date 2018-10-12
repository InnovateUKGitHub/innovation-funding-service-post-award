import {DataState, DataStateKeys, RootState} from "../reducers";
import { Pending } from "../../../shared/pending";

export const getData = (state: RootState): DataState => (state.data) || {};
export const getDataStore = <T extends DataStateKeys>(state: RootState, store: T): DataState[T] => getData(state)[store] || {};
export const getDataStoreItem = <T extends DataStateKeys, K extends keyof DataState[T]>(state: RootState, store: T, key: K): DataState[T][K] => getDataStore(state, store)[key];

export const dataStoreHelper = <T extends DataStateKeys, K extends keyof DataState[T], TDto>(storeKey: T, key: K) => {
  return ({
      store: storeKey,
      key: key as string,
      get: (state: RootState) => getDataStoreItem(state, storeKey, key),
      getPending: (state: RootState) => Pending.create(getDataStoreItem(state, storeKey, key))
    })
};