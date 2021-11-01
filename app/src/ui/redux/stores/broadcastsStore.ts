import { storeKeys } from "@ui/redux/stores/storeKeys";
import { apiClient } from "../../apiClient";
import { RootState } from "../reducers";
import { RootActionsOrThunk } from "../actions";
import { StoreBase } from "./storeBase";

export class BroadcastsStore extends StoreBase {
  constructor(getState: () => RootState, dispatch: (action: RootActionsOrThunk) => void) {
    super(getState, dispatch);
  }

  public getAll() {
    return this.getData("broadcasts", storeKeys.getBroadcastsKey(), p => apiClient.broadcasts.getAll(p));
  }

  public get(broadcastId: string) {
    return this.getData("broadcast", storeKeys.getBroadcastKey(broadcastId), p =>
      apiClient.broadcasts.get({ ...p, broadcastId }),
    );
  }
}
