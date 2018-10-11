import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { claimDetailsStore, findClaimDetailsByPartner } from "../selectors/claimDetails";

export function loadClaimDetailsForPartner(partnerId: string) {
  return conditionalLoad(
    findClaimDetailsByPartner(partnerId).key,
    claimDetailsStore,
    () => ApiClient.claimDetails.getAllByPartner(partnerId)
  );
}
