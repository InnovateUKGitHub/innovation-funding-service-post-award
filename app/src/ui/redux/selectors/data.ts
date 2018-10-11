import {DataState, DataStores, RootState} from "../reducers";

export const getData = (state: RootState): DataState => (state.data) || {};
export const getDataStore = <T extends DataStores>(state: RootState, store: T): DataState[T] => getData(state)[store] || {};
export const getDataStoreItem = <T extends DataStores, K extends keyof DataState[T]>(state: RootState, store: T, key: K): DataState[T][K] => getDataStore(state, store)[key];
