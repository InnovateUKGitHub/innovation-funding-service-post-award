import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";

export class ClaimsDetailsStore extends StoreBase {
  public getAllByPartner(partnerId: string) {
    return this.getData("claimDetails", partnerId, p => ApiClient.claimDetails.getAllByPartner({partnerId, ...p}));
  }
}
