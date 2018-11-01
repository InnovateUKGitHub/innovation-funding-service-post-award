import {conditionalLoad} from "./dataLoad";
import { claimsStore, findClaimsByPartner } from "../selectors/claims";
import {ApiClient} from "../../../shared/apiClient";

export function loadClaimsForPartner(partnerId: string) {
  return conditionalLoad(
    findClaimsByPartner(partnerId).key,
    claimsStore,
    (params) => ApiClient.claims.getAllByPartnerId({ partnerId, ...params})
  );
}
