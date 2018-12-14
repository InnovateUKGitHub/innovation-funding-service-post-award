import { dataStoreHelper, editorStoreHelper } from "./common";
import { getKey } from "../../../util/key";
import { LoadingStatus, Pending } from "../../../shared/pending";
import {DocumentUploadValidator} from "../../validators/documentUploadValidator";
import { IEditorStore, RootState } from "../reducers";
import { getCurrentClaim } from "./claims";
import { DocumentDescription } from "../../../types";
import { Results } from "../../validation/results";

export const documentStore = "documents";
export const documentSummaryEditorStore = "documentSummary";

export const getClaimDetailDocuments = (partnerId: string, periodId: number, costCategoryId: string) => dataStoreHelper(documentStore, getKey("claim", "detail", partnerId, periodId, costCategoryId));

export const getClaimDocuments = (partnerId: string, periodId: number) => dataStoreHelper(documentStore, getKey("claim", partnerId, periodId));

export const getClaimDetailDocumentEditor = ({partnerId, periodId, costCategoryId}: ClaimDetailKey) => editorStoreHelper<DocumentUploadDto, DocumentUploadValidator>(
  documentStore,
  x => x.documents,
  () => (Pending.create({ status: LoadingStatus.Done, data: { file: null }, error: null})),
  (dto) => new DocumentUploadValidator(dto, false),
  getKey("claim", "details", partnerId, periodId, costCategoryId)
);

export const getClaimDetailDocumentDeleteEditors = (state: RootState, partnerId: string, periodId: number, costCategoryId: string): Pending<IEditorStore<DocumentSummaryDto, Results<DocumentSummaryDto>>[]> => {
  return getClaimDetailDocuments(partnerId, periodId, costCategoryId).getPending(state).then(documents => {
    return (documents || []).map(document => {
      const editorPending = getDocumentDeleteEditor(document).get(state);
      return editorPending.data!;
    });
  });
};

export const getClaimDocumentEditor = ({partnerId, periodId}: ClaimKey, description?: string) => editorStoreHelper<DocumentUploadDto, DocumentUploadValidator>(
  documentStore,
  x => x.documents,
  () => (Pending.create({ status: LoadingStatus.Done, data: { file: null, description }, error: null})),
  (dto) => new DocumentUploadValidator(dto, false),
  getKey("claim", partnerId, periodId)
);

export const getDocumentDeleteEditor = (document: DocumentSummaryDto) => editorStoreHelper<DocumentSummaryDto, Results<DocumentSummaryDto>>(
  documentSummaryEditorStore,
  x => x.documentSummary,
  () => (Pending.create({ status: LoadingStatus.Done, data: document, error: null})),
  () => new Results(document, false),
  getKey(document.id)
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

export const getCurrentClaimIarDocumentsDeleteEditor = (state: RootState, partnerId: string): Pending<IEditorStore<DocumentSummaryDto, Results<DocumentSummaryDto>> | null> => {
  return getCurrentClaimIarDocument(state, partnerId).then(document => {
    if (!document) {
      return null;
    }
    const editorPending =  getDocumentDeleteEditor(document).get(state);
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
