import {conditionalLoad} from "./dataLoad";
import { ApiClient } from "../../apiClient";
import { claimDetailsStore, findClaimDetailsByPartner } from "../selectors/claimDetails";

export function loadClaimDetailsForPartner(partnerId: string) {
  return conditionalLoad(
    findClaimDetailsByPartner(partnerId).key,
    claimDetailsStore,
    (params) => ApiClient.claimDetails.getAllByPartner({partnerId, ...params})
  );
}
