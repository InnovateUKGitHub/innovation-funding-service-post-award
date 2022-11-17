import { apiClient } from "@ui/apiClient";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { StoreBase } from "./storeBase";

export class ClaimOverridesStore extends StoreBase {
  public getAllByPartner(partnerId: string) {
    return this.getData("claimOverrides", storeKeys.getClaimOverrideKey(partnerId), p =>
      apiClient.claimOverrides.getAllByPartner({ partnerId, ...p }),
    );
  }
}
