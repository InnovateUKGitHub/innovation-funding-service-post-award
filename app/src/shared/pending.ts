import { IDataStore } from "../ui/redux";

type MapPendings<T> = {
  [P in keyof T]: T[P] extends Pending<infer U> ? U : never;
};

export enum LoadingStatus {
    Preload = 1, // State before a request is made to the server, may have partial data.
    Loading = 2, // A request has been made to the server, waiting for data.
    Done = 3,    // The server has responded, data ready to display.
    Failed = 4,  // The server returned an error, data may be... in any state.
    Stale = 5    // The data is ready to display, but it is thought to be out of date.
}

/**
 * @class Pending
 * assign a state to a data object T so we can act consistently
 * also has utility functions for creation and transformation
 */
export class Pending<T> {
    constructor(
        public state: LoadingStatus = LoadingStatus.Preload,
        public data: T | null | undefined = null,
        public error?: any
    ) { }

    /**
     * transform the data T in this Pending into another datastruct T2
     * @param map - a function which takes the data T, the current status and error, and returns new data T2
     * @param noData - a function to use when no data present to return data T2
     * @return Pending<T2>
     */
    then<T2>(map: (data: T | null | undefined, state?: LoadingStatus, error?: any) => T2, noData?: () => T2) {
        let newData: T2 | null | undefined = null;
        if (this.state === LoadingStatus.Done || this.data || (this.data as any as number) === 0) {
            newData = map(this.data, this.state, this.error);
        }
        else if (noData) {
            newData = noData();
        }

        return new Pending<T2>(this.state, newData, this.error);
    }

    /**
     * combine this pending with another to create a new Pending with a defined datastruct
     * @param pending - the object to combine with this one
     * @param combineData - a function that takes both Pendings and returns the combined data
     * @return Pending<TR>
     */
    and<T2, TR extends { [k: string]: Pending<T> | Pending<T2> }>(
      pending: Pending<T2>,
      combineData: (pending1: Pending<T>, pending2: Pending<T2>) => TR
    ): Pending<MapPendings<TR>> {
      const combined = combineData(this, pending);
      return Pending.combine(combined);
    }

    /**
     * provide ways to combine multiple Pending objects into a single Pending source
     * @param pendings - an associative array of Pendings that defines the shape of the returned pending with it's keys
     */
    static combine<T extends { [k: string]: Pending<any> }, TR extends MapPendings<T>>(pendings: T): Pending<TR> {
      const keys = Object.keys(pendings);
      const errors = keys.map(k => pendings[k].error).find(x => !!x);
      const state = Pending.lowestState(keys.map(k => pendings[k].state));
      const data = Pending.allComplete(keys.map(k => pendings[k]))
        ? keys.reduce((combined, k) => Object.assign({}, combined, {[k]: pendings[k].data }), {}) as TR
        : null;

      return new Pending(state, data, errors);
    }

    /**
     * check if all the Pendings given are in the Done state or have data
     * @param pendings - collection of pending objects to be checked
     * @return boolean
     */
    private static allComplete(pendings: Pending<{}>[]) {
        return pendings.every(p => {
            if (p.state !== LoadingStatus.Done && p.state !== LoadingStatus.Stale && (p.data === null || p.data === undefined)) {
                return false;
            }
            return true;
        });
    }

    /**
     * create a new Pending in the Done state with data T
     * @param data - the data to create the new Pending with
     * @return Pending
     */
    static done<T>(data: T): Pending<T> {
        return new Pending<T>(LoadingStatus.Done, data);
    }

    /**
     * merge multiple Pendings together
     * @param pendings - collection of Pendings to be merged
     * @return Pending
     */
    static flatten<T>(pendings: Pending<T>[]): Pending<T[]> {
        const state = Pending.lowestState(pendings.map(x => x.state));
        const data = Pending.allComplete(pendings) ? pendings.map(x => x.data!) : null;
        const error = pendings.filter(x => !!x.error).map(x => x.error).shift();
        return new Pending<T[]>(state, data, error);
    }

    static create<T>(stored: IDataStore<T> | null): Pending<T> {
        let status = LoadingStatus.Preload;
        let data = null;
        let error = null;

        if (!!stored) {
            status = stored.status;
            data = stored.data;
            error = stored.error;
        }

        return new Pending<T>(status, data, error);
    }

    static lowestState(states: LoadingStatus[]) {
      const orderedStates = [
        LoadingStatus.Failed,
        LoadingStatus.Loading,
        LoadingStatus.Preload,
        LoadingStatus.Stale
      ];

      let result = LoadingStatus.Done;
      orderedStates.forEach(state => {
          if (result === LoadingStatus.Done && states.indexOf(state) >= 0) {
              result = state;
          }
      });
      return result;
    }

    /**
     * say if the status is marked as Done
     */
    isDone() {
      return this.state === LoadingStatus.Done;
    }

  /**
   * determine if the data has been marked as Done or if it's available for reading
   * @return boolean
   */
    isReady() {
        return this.isDone() || this.data;
    }

    /**
     * determine if the data has been marked as failed
     * @return boolean
     */
    isFailed() {
        return this.state === LoadingStatus.Failed;
    }

    setStale() {
        this.state = LoadingStatus.Stale;
    }
}
