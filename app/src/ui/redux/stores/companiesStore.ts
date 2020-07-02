import { ApiClient } from "@ui/apiClient";
import { RootActionsOrThunk } from "../actions";
import { PartnersStore } from "./partnersStore";
import { RootState } from "../reducers";
import { StoreBase } from "./storeBase";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class CompaniesStore extends StoreBase {

  constructor(private readonly partnerStore: PartnersStore, getState: () => RootState, queue: (action: RootActionsOrThunk) => void) {
    super(getState, queue);
  }

  private getKey(searchString: string, itemsPerPage?: number, startIndex?: number) {
    return storeKeys.getCompaniesKey(searchString, itemsPerPage, startIndex);
  }

  public getCompanies(searchString: string, itemsPerPage?: number, startIndex?: number) {
    return this.getData("companies", this.getKey(searchString, itemsPerPage, startIndex), p => ApiClient.companies.searchCompany({ searchString, itemsPerPage, startIndex, ...p }));
  }

}
