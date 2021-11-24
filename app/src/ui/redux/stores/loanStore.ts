import { storeKeys } from "@ui/redux/stores/storeKeys";
import { Pending } from "@shared/pending";
import { LoanDto } from "@framework/dtos";
import { apiClient } from "../../apiClient";
import { RootState } from "../reducers";
import { RootActionsOrThunk } from "../actions";
import { StoreBase } from "./storeBase";

export class LoansStore extends StoreBase {
  constructor(getState: () => RootState, dispatch: (action: RootActionsOrThunk) => void) {
    super(getState, dispatch);
  }

  public getAll(projectId: string): Pending<LoanDto[]> {
    return this.getData("loans", storeKeys.getLoansKey(projectId), p => apiClient.loans.getAll({ ...p, projectId }));
  }
}
