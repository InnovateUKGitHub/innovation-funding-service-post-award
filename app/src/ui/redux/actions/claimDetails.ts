import { ApiClient } from "../../apiClient";
import { conditionalLoad } from "./common";
import { findClaimDetailsByPartner, findClaimDetailsSummaryByPartnerAndPeriod } from "../selectors";

export function loadClaimDetailsForPartner(partnerId: string) {
  const selector = findClaimDetailsByPartner(partnerId);
  return conditionalLoad(selector.key, selector.store, params => ApiClient.claimDetails.getAllByPartner({partnerId, ...params}));
}

export function loadClaimDetailsSummaryForPartner(partnerId: string, periodId: number) {
  const selector = findClaimDetailsSummaryByPartnerAndPeriod(partnerId, periodId);
  return conditionalLoad(selector.key, selector.store, params => ApiClient.claimDetailsSummary.getAllByPartnerIdForPeriod({partnerId, periodId, ...params}));
}
