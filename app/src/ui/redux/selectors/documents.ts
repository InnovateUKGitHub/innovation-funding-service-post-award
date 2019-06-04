import { dataStoreHelper, editorStoreHelper, IEditorSelector } from "./common";
import { LoadingStatus, Pending } from "../../../shared/pending";
import { DocumentUploadValidator } from "../../validators/documentUploadValidator";
import { IEditorStore, RootState } from "../reducers";
import { getCurrentClaim, getLeadPartnerCurrentClaim } from "./claims";
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
  () => Pending.done({ file: null }),
  (dto) => Pending.done(new DocumentUploadValidator(dto, false)),
  getKey("project", projectId)
);

export const getClaimDetailDocumentEditor = ({ partnerId, periodId, costCategoryId }: ClaimDetailKey) => editorStoreHelper<DocumentUploadDto, DocumentUploadValidator>(
  documentStore,
  x => x.documents,
  () => Pending.done({ file: null }),
  (dto) => Pending.done(new DocumentUploadValidator(dto, false)),
  getKey("claim", "details", partnerId, periodId, costCategoryId)
);

export const getClaimDetailDocumentDeleteEditorStoreInfo = ({ partnerId, periodId, costCategoryId }: ClaimDetailKey, documents: DocumentSummaryDto[]) => {
  return getDocumentsDeleteEditor(getKey("claimDetail", partnerId, periodId, costCategoryId), documents);
};

export const getClaimDetailDocumentDeleteEditor = (state: RootState, { projectId, partnerId, periodId, costCategoryId }: ClaimDetailKey): IEditorSelector<DocumentSummaryDto[], Results<DocumentSummaryDto[]>> => {
  const documents = getClaimDetailDocuments(partnerId, periodId, costCategoryId).get(state).data;
  return getClaimDetailDocumentDeleteEditorStoreInfo({ projectId, partnerId, periodId, costCategoryId }, documents || []);
};

export const getClaimDocumentEditor = ({ partnerId, periodId }: ClaimKey, description?: string) => editorStoreHelper<DocumentUploadDto, DocumentUploadValidator>(
  documentStore,
  x => x.documents,
  () => Pending.done({ file: null, description }),
  (dto) => Pending.done(new DocumentUploadValidator(dto, false)),
  getKey("claim", partnerId, periodId)
);

const getDocumentsDeleteEditor = (key: string, documents: DocumentSummaryDto[]) => editorStoreHelper<DocumentSummaryDto[], Results<DocumentSummaryDto[]>>(
  documentSummaryEditorStore,
  x => x.documentSummary,
  () => Pending.done(documents),
  () => Pending.done(new Results(documents, false)),
  key
);

export const getCurrentClaimIarDocumentsEditor = (state: RootState, projectId: string, partnerId: string): Pending<IEditorStore<DocumentUploadDto, DocumentUploadValidator> | null> => {
  return getCurrentClaim(state, partnerId).then(claim => {
    if (!claim) {
      return null;
    }
    const editorPending = getClaimDocumentEditor({ projectId, partnerId: claim.partnerId, periodId: claim.periodId }, DocumentDescription.IAR).get(state);
    return editorPending.data || null;
  });
};

export const getCurrentClaimIarDocumentsEditorForLeadPartner = (state: RootState, projectId: string): Pending<IEditorStore<DocumentUploadDto, DocumentUploadValidator> | null> => {
  return getLeadPartnerCurrentClaim(state, projectId).chain(claim => {
    if (!claim) return new Pending(LoadingStatus.Done, null);
    return getClaimDocumentEditor({ projectId, partnerId: claim.partnerId, periodId: claim.periodId }, DocumentDescription.IAR).get(state);
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
    const editorPending = getDocumentDeleteEditor(document).get(state);
    return editorPending.data || null;
  });
};

export const getCurrentClaimIarDocumentsDeleteEditorForLeadPartner = (state: RootState, projectId: string): Pending<IEditorStore<DocumentSummaryDto[], Results<DocumentSummaryDto[]>> | null> => {
  return getCurrentClaimIarDocumentForLeadPartner(state, projectId).chain(document => {
    if (!document) {
      return new Pending(LoadingStatus.Done, null);
    }
    return getDocumentDeleteEditor(document).get(state);
  });
};

export const getIarDocument = (state: RootState, partnerId: string, periodId: number): Pending<DocumentSummaryDto | null> => {
  return getClaimDocuments(partnerId, periodId).getPending(state).then(documents => {
    return (documents && documents.find(x => x.description === DocumentDescription.IAR)) || null;
  });
};

export const getCurrentClaimIarDocument = (state: RootState, partnerId: string): Pending<DocumentSummaryDto | null> => {
  return getCurrentClaim(state, partnerId).chain(claim => {
    if (!claim) {
      return new Pending(LoadingStatus.Done, null);
    }
    return getIarDocument(state, claim.partnerId, claim.periodId);
  });
};

export const getCurrentClaimIarDocumentForLeadPartner = (state: RootState, projectId: string): Pending<DocumentSummaryDto | null> => {
  return getLeadPartnerCurrentClaim(state, projectId).chain(claim => {
    if (!claim) return new Pending(LoadingStatus.Done, null);
    return  getIarDocument(state, claim.partnerId, claim.periodId);
  });
};
