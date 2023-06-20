import { storeKeys } from "@ui/redux/stores/storeKeys";
import { Pending } from "@shared/pending";
import { apiClient } from "../../apiClient";
import { StoreBase } from "./storeBase";
import { AccountDto } from "@framework/dtos/accountDto";
import { RootActionsOrThunk } from "../actions/root";
import { RootState } from "../reducers/rootReducer";

export class AccountsStore extends StoreBase {
  constructor(getState: () => RootState, dispatch: (action: RootActionsOrThunk) => void) {
    super(getState, dispatch);
  }

  public getJesAccountsByName(searchString: string): Pending<AccountDto[]> {
    return this.getData("jesOnlyAccounts", storeKeys.getJesAccountKey(searchString), p =>
      apiClient.accounts.getAllByJesName({ ...p, searchString }),
    );
  }
}
