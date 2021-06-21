import { storeKeys } from "@ui/redux/stores/storeKeys";
import { apiClient } from "../../apiClient";
import { RootState } from "../reducers";
import { RootActionsOrThunk } from "../actions";
import { StoreBase } from "./storeBase";

export class AccountsStore extends StoreBase {
  constructor(getState: () => RootState, dispatch: (action: RootActionsOrThunk) => void) {
    super(getState, dispatch);
  }

  public getAccounts() {
    return this.getData("accounts", storeKeys.getAccountKey(), p => apiClient.accounts.getAll(p));
  }
}
