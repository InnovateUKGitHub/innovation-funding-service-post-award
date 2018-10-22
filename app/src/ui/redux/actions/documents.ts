import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import {documentStore, getDocuments} from "../selectors/documents";

export function loadDocuments(id: string) {
  return conditionalLoad(
    getDocuments(id).key,
    documentStore,
    () => ApiClient.documents.getAllForRecord(id)
  );
}
