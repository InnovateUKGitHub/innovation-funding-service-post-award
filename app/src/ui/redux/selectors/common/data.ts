import { Pending } from "@shared/pending";
import { DataStateKeys, IDataStore } from "@ui/redux/reducers/dataReducer";
import { RootState } from "@ui/redux/reducers/rootReducer";

export interface IDataSelector<T> {
  store: DataStateKeys;
  key: string;
  get: (state: RootState) => IDataStore<T>;
  getPending: (state: RootState) => Pending<T>;
}
