import { apiClient } from "@ui/apiClient";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { RootActionsOrThunk } from "../actions/root";
import { RootState } from "../reducers/rootReducer";
import { StoreBase } from "./storeBase";

export class CompaniesStore extends StoreBase {
  constructor(getState: () => RootState, queue: (action: RootActionsOrThunk) => void) {
    super(getState, queue);
  }

  private getKey(searchString: string, itemsPerPage?: number, startIndex?: number) {
    return storeKeys.getCompaniesKey(searchString, itemsPerPage, startIndex);
  }

  public getCompanies(searchString: string, itemsPerPage?: number, startIndex?: number) {
    return this.getData("companies", this.getKey(searchString, itemsPerPage, startIndex), p =>
      apiClient.companies.searchCompany({ ...p, searchString, itemsPerPage, startIndex }),
    );
  }
}
