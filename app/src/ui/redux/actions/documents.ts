import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import {documentStore, getClaimDetailDocuments} from "../selectors/documents";

export function loadClaimDetailDocuments(partnerId: string, periodId: number, costCategoryId: string) {
  return conditionalLoad(
    getClaimDetailDocuments(partnerId, periodId, costCategoryId).key,
    documentStore,
    (params) => ApiClient.documents.getClaimDetailDocuments({partnerId, periodId, costCategoryId, ...params})
  );
}
