import { conditionalLoad } from "./common";
import { ApiClient } from "../../apiClient";
import { getClaimDetailDocuments } from "../selectors/documents";

export function loadClaimDetailDocuments(partnerId: string, periodId: number, costCategoryId: string) {
  const selector = getClaimDetailDocuments(partnerId, periodId, costCategoryId);
  return conditionalLoad(selector.key, selector.store, params => ApiClient.documents.getClaimDetailDocuments({partnerId, periodId, costCategoryId, ...params}));
}
