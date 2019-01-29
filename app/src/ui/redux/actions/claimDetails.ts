import { ApiClient } from "../../apiClient";
import { conditionalLoad } from "./common";
import { findClaimDetailsByPartner, findClaimDetailsSummaryByPartnerAndPeriod } from "../selectors";

export function loadClaimDetailsForPartner(partnerId: string) {
  return conditionalLoad(findClaimDetailsByPartner(partnerId), params => ApiClient.claimDetails.getAllByPartner({partnerId, ...params}));
}

export function loadClaimDetailsSummaryForPartner(projectId: string, partnerId: string, periodId: number) {
  return conditionalLoad(
    findClaimDetailsSummaryByPartnerAndPeriod(partnerId, periodId),
    params => ApiClient.claimDetailsSummary.getAllByPartnerIdForPeriod({projectId, partnerId, periodId, ...params})
  );
}
