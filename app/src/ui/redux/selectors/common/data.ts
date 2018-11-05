import {DataState, DataStateKeys, IDataStore, RootState} from "../../reducers";
import { Pending } from "../../../../shared/pending";

type Infer<T> = T extends IDataStore<infer U> ? U : never;

export interface IDataSelector<T> {
  store: DataStateKeys;
  key: string;
  get: (state: RootState) => IDataStore<T>;
  getPending: (state: RootState) => Pending<T>;
}

const getDataStoreItem = <T extends DataStateKeys, K extends string>(state: RootState, store: T, key: K) => {
  const data = state.data || {};
  const dataStore = data[store] || {};
  return dataStore[key];
};

export const dataStoreHelper = <T extends DataStateKeys, K extends string, TDto extends Infer<DataState[T][K]>>(store: T, key: K): IDataSelector<TDto> => ({
  store,
  key,
  get: state => getDataStoreItem(state, store, key) as IDataStore<TDto>,
  getPending: state => Pending.create(getDataStoreItem(state, store, key) as IDataStore<TDto>)
});
