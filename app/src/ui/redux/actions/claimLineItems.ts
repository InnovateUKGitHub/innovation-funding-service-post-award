import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { claimLineItemsStore, findClaimLineItemsByPartnerCostCategoryAndPeriod } from "../selectors/claimLineItems";

export function loadClaimLineItemsForCategory(partnerId: string, costCategoryId: string, periodId: number) {
  return conditionalLoad(
    findClaimLineItemsByPartnerCostCategoryAndPeriod(partnerId, costCategoryId, periodId).key,
    claimLineItemsStore,
    () => ApiClient.claimLineItems.getAllForCategory(partnerId, costCategoryId, periodId)
  );
}
