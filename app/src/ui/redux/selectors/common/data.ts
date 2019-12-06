import {DataStateKeys, IDataStore, RootState} from "@ui/redux/reducers";
import { Pending } from "@shared/pending";

export interface IDataSelector<T> {
  store: DataStateKeys;
  key: string;
  get: (state: RootState) => IDataStore<T>;
  getPending: (state: RootState) => Pending<T>;
}
