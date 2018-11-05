import { ApiClient } from "../../apiClient";
import { conditionalLoad } from "./common";
import { getClaimDetailDocuments } from "../selectors/documents";

export function loadClaimDetailDocuments(partnerId: string, periodId: number, costCategoryId: string) {
  return conditionalLoad(
    getClaimDetailDocuments(partnerId, periodId, costCategoryId),
    params => ApiClient.documents.getClaimDetailDocuments({partnerId, periodId, costCategoryId, ...params})
  );
}
