import { ApiClient } from "../../apiClient";
import { conditionalLoad } from "./common";
import { findClaimDetailsByPartner, getClaimDetails, getCostsSummaryForPeriod } from "../selectors";

export function loadClaimDetailsForPartner(partnerId: string) {
  return conditionalLoad(findClaimDetailsByPartner(partnerId), params => ApiClient.claimDetails.getAllByPartner({partnerId, ...params}));
}

export function loadCostsSummaryForPeriod(projectId: string, partnerId: string, periodId: number) {
  return conditionalLoad(
    getCostsSummaryForPeriod(partnerId, periodId),
    params => ApiClient.costsSummary.getAllByPartnerIdForPeriod({projectId, partnerId, periodId, ...params})
  );
}

export function loadClaimDetails(partnerId: string, periodId: number, costCategoryId: string) {
  return conditionalLoad(getClaimDetails(partnerId, periodId, costCategoryId), params => ApiClient.claimDetails.get({partnerId, periodId, costCategoryId, ...params}));

}
