import { dataStoreHelper, editorStoreHelper, IEditorSelector } from "./common";
import { LoadingStatus, Pending } from "../../../shared/pending";
import {DocumentUploadValidator} from "../../validators/documentUploadValidator";
import { IEditorStore, RootState } from "../reducers";
import { getCurrentClaim } from "./claims";
import { getKey } from "@framework/util";
import { DocumentDescription } from "@framework/types";
import { Results } from "../../validation/results";

export const documentStore = "documents";
export const documentSummaryEditorStore = "documentSummary";

export const getClaimDetailDocuments = (partnerId: string, periodId: number, costCategoryId: string) => dataStoreHelper(documentStore, getKey("claim", "detail", partnerId, periodId, costCategoryId));

export const getClaimDocuments = (partnerId: string, periodId: number) => dataStoreHelper(documentStore, getKey("claim", partnerId, periodId));

export const getProjectDocuments = (projectId: string) => dataStoreHelper(documentStore, getKey("project", projectId));

export const getProjectDocumentEditor = (projectId: string) => editorStoreHelper<DocumentUploadDto, DocumentUploadValidator>(
  documentStore,
  x => x.documents,
  () => Pending.create({ status: LoadingStatus.Done, data: { file: null }, error: null }),
  (dto) => new DocumentUploadValidator(dto, false),
  getKey("project", projectId)
);

export const getClaimDetailDocumentEditor = ({partnerId, periodId, costCategoryId}: ClaimDetailKey) => editorStoreHelper<DocumentUploadDto, DocumentUploadValidator>(
  documentStore,
  x => x.documents,
  () => (Pending.create({ status: LoadingStatus.Done, data: { file: null }, error: null})),
  (dto) => new DocumentUploadValidator(dto, false),
  getKey("claim", "details", partnerId, periodId, costCategoryId)
);

export const getClaimDetailDocumentDeleteEditorStoreInfo = ({partnerId, periodId, costCategoryId}: ClaimDetailKey, documents: DocumentSummaryDto[]) => {
  return getDocumentsDeleteEditor(getKey("claimDetail", partnerId, periodId, costCategoryId), documents);
};

export const getClaimDetailDocumentDeleteEditor = (state: RootState, {projectId, partnerId, periodId, costCategoryId}: ClaimDetailKey): IEditorSelector<DocumentSummaryDto[], Results<DocumentSummaryDto[]>> => {
  const documents = getClaimDetailDocuments(partnerId, periodId, costCategoryId).get(state).data;
  return getClaimDetailDocumentDeleteEditorStoreInfo({projectId, partnerId, periodId, costCategoryId}, documents || []);
};

export const getClaimDocumentEditor = ({partnerId, periodId}: ClaimKey, description?: string) => editorStoreHelper<DocumentUploadDto, DocumentUploadValidator>(
  documentStore,
  x => x.documents,
  () => (Pending.create({ status: LoadingStatus.Done, data: { file: null, description }, error: null})),
  (dto) => new DocumentUploadValidator(dto, false),
  getKey("claim", partnerId, periodId)
);

const getDocumentsDeleteEditor = (key: string, documents: DocumentSummaryDto[]) => editorStoreHelper<DocumentSummaryDto[], Results<DocumentSummaryDto[]>>(
  documentSummaryEditorStore,
  x => x.documentSummary,
  () => (Pending.create({ status: LoadingStatus.Done, data: documents, error: null})),
  () => new Results(documents, false),
  key
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

export const getDocumentDeleteEditor = (document: DocumentSummaryDto): IEditorSelector<DocumentSummaryDto[], Results<DocumentSummaryDto[]>> => {
  return getDocumentsDeleteEditor(document.id, (document && [document]) || []);
};

export const getCurrentClaimIarDocumentsDeleteEditor = (state: RootState, partnerId: string): Pending<IEditorStore<DocumentSummaryDto[], Results<DocumentSummaryDto[]>> | null> => {
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
