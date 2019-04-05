import { ApiClient } from "../../apiClient";
import { conditionalLoad } from "./common";
import { findClaimDetailsByPartner, findClaimDetailsSummaryByPartnerAndPeriod, getClaimDetails } from "../selectors";

export function loadClaimDetailsForPartner(partnerId: string) {
  return conditionalLoad(findClaimDetailsByPartner(partnerId), params => ApiClient.claimDetails.getAllByPartner({partnerId, ...params}));
}

export function loadClaimDetailsSummaryForPartner(projectId: string, partnerId: string, periodId: number) {
  return conditionalLoad(
    findClaimDetailsSummaryByPartnerAndPeriod(partnerId, periodId),
    params => ApiClient.claimDetailsSummary.getAllByPartnerIdForPeriod({projectId, partnerId, periodId, ...params})
  );
}

export function loadClaimDetails(partnerId: string, periodId: number, costCategoryId: string) {
  return conditionalLoad(getClaimDetails(partnerId, periodId, costCategoryId), params => ApiClient.claimDetails.get({partnerId, periodId, costCategoryId, ...params}));

}
