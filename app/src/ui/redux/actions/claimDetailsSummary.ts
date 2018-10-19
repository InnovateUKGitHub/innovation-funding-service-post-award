import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { claimDetailsSummaryStore, findClaimDetailsSummaryByPartnerAndPeriod } from "../selectors/claimDetailsSummary";

export function loadClaimDetailsSummaryForPartner(partnerId: string, periodId: number) {
  return conditionalLoad(
    findClaimDetailsSummaryByPartnerAndPeriod(partnerId, periodId).key,
    claimDetailsSummaryStore,
    () => ApiClient.claimDetailsSummary.getAllByPartnerIdForPeriod(partnerId, periodId)
  );
}
