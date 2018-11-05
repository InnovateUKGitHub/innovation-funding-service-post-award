import { ApiClient } from "../../apiClient";
import { conditionalLoad } from "./common";
import { findClaimDetailsByPartner, findClaimDetailsSummaryByPartnerAndPeriod } from "../selectors";

export function loadClaimDetailsForPartner(partnerId: string) {
  return conditionalLoad(findClaimDetailsByPartner(partnerId), params => ApiClient.claimDetails.getAllByPartner({partnerId, ...params}));
}

export function loadClaimDetailsSummaryForPartner(partnerId: string, periodId: number) {
  return conditionalLoad(
    findClaimDetailsSummaryByPartnerAndPeriod(partnerId, periodId),
    params => ApiClient.claimDetailsSummary.getAllByPartnerIdForPeriod({partnerId, periodId, ...params})
  );
}
