import {conditionalLoad} from "./dataLoad";
import { ApiClient } from "../../apiClient";
import { claimDetailsSummaryStore, findClaimDetailsSummaryByPartnerAndPeriod } from "../selectors/claimDetailsSummary";

export function loadClaimDetailsSummaryForPartner(partnerId: string, periodId: number) {
  return conditionalLoad(
    findClaimDetailsSummaryByPartnerAndPeriod(partnerId, periodId).key,
    claimDetailsSummaryStore,
    (params) => ApiClient.claimDetailsSummary.getAllByPartnerIdForPeriod({partnerId, periodId, ...params})
  );
}
