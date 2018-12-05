import { dataStoreHelper, editorStoreHelper } from "./common";
import { getKey } from "../../../util/key";
import { LoadingStatus, Pending } from "../../../shared/pending";
import {DocumentUploadValidator} from "../../validators/documentUploadValidator";
import { IEditorStore, RootState } from "../reducers";
import { getCurrentClaim } from "./claims";
import { DocumentDescription } from "../../../types";

export const documentStore = "documents";
export const getClaimDetailDocuments = (partnerId: string, periodId: number, costCategoryId: string) => dataStoreHelper(documentStore, getKey("claim", "detail", partnerId, periodId, costCategoryId));

export const getClaimDocuments = (partnerId: string, periodId: number) => dataStoreHelper(documentStore, getKey("claim", partnerId, periodId));

export const getClaimDetailDocumentEditor = ({partnerId, periodId, costCategoryId}: ClaimDetailKey) => editorStoreHelper<DocumentUploadDto, DocumentUploadValidator>(
  documentStore,
  x => x.documents,
  () => (Pending.create({ status: LoadingStatus.Done, data: { file: null }, error: null})),
  (dto) => new DocumentUploadValidator(dto, false),
  getKey("claim", "details", partnerId, periodId, costCategoryId)
);

export const getClaimDocumentEditor = ({partnerId, periodId}: ClaimKey, description?: string) => editorStoreHelper<DocumentUploadDto, DocumentUploadValidator>(
  documentStore,
  x => x.documents,
  () => (Pending.create({ status: LoadingStatus.Done, data: { file: null, description }, error: null})),
  (dto) => new DocumentUploadValidator(dto, false),
  getKey("claim", partnerId, periodId)
);

export const getCurrentClaimIarDocumentsEditor = (state: RootState, partnerId: string): Pending<IEditorStore<DocumentUploadDto, DocumentUploadValidator> | null> => {
  return getCurrentClaim(state, partnerId).then(claim => {
    if (!claim) {
      return null;
    }
    const editorPending =  getClaimDocumentEditor({partnerId, periodId: claim.periodId}, DocumentDescription.IAR).get(state);
    return editorPending.data || null;
  });
};

export const getIarDocument = (state: RootState, partnerId: string, periodId: number): Pending<DocumentSummaryDto | null> => {
  return getClaimDocuments(partnerId, periodId).getPending(state).then(documents => {
    return (documents && documents.find(x => x.description === DocumentDescription.IAR)) || null;
  });
};

export const getCurrentClaimIarDocument = (state: RootState, partnerId: string): Pending<DocumentSummaryDto | null> => {
  return getCurrentClaim(state, partnerId).then(claim => {
    if (!claim) {
      return null;
    }
    return getIarDocument(state,partnerId, claim.periodId).data || null;
  });
};
