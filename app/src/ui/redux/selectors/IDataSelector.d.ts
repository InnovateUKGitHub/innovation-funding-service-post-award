import {IDataStore, RootState} from "../reducers";
import {Pending} from "../../../shared/pending";

interface IDataSelector<T> {
  key: string;
  get: (state: RootState) => IDataStore<T>;
  getPending: (state: RootState) => Pending<T>;
}
