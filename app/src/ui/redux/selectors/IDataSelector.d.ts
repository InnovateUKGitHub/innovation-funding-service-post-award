import {DataStateKeys, IDataStore, RootState} from "../reducers";
import {Pending} from "../../../shared/pending";

interface IDataSelector<T> {
  store?: DataStateKeys;
  key: string;
  get: (state: RootState) => IDataStore<T>;
  getPending: (state: RootState) => Pending<T>;
}
