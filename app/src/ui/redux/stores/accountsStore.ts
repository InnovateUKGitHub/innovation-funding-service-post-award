import { ApiClient } from "../../apiClient";
import { RootState } from "../reducers";
import { StoreBase } from "./storeBase";
import { RootActionsOrThunk } from "../actions";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class AccountsStore extends StoreBase {
  constructor(getState: () => RootState, dispatch: (action: RootActionsOrThunk) => void) {
    super(getState, dispatch);
  }

  public getAccounts() {
    return this.getData("accounts", storeKeys.getAccountKey(), p => ApiClient.accounts.getAll(p));
  }
}
