import { dataStoreHelper, editorStoreHelper, IEditorSelector } from "./common";
import { LoadingStatus, Pending } from "../../../shared/pending";
import { DocumentUploadDtoValidator, MultipleDocumentUpdloadDtoValidator } from "../../validators/documentUploadValidator";
import { IEditorStore, RootState } from "../reducers";
import { getCurrentClaim, getLeadPartnerCurrentClaim } from "./claims";
import { getKey } from "@framework/util";
import { ClaimDto, DocumentDescription } from "@framework/types";
import { Results } from "../../validation/results";

export const documentStore = "documents";
export const documentSummaryEditorStore = "documentSummary";

export const getClaimDetailDocuments = (partnerId: string, periodId: number, costCategoryId: string) => dataStoreHelper(documentStore, getKey("claim", "detail", partnerId, periodId, costCategoryId));

export const getClaimDocuments = (partnerId: string, periodId: number) => dataStoreHelper(documentStore, getKey("claim", partnerId, periodId));

export const getProjectDocuments = (projectId: string) => dataStoreHelper(documentStore, getKey("project", projectId));

export const getProjectChangeRequestDocumentsOrItemDocuments = (projectChangeRequestIdOrItemId: string) => dataStoreHelper(documentStore, getKey("projectChangeRequestItem", projectChangeRequestIdOrItemId));

export const getProjectDocumentEditor = (projectId: string) => editorStoreHelper<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>(
  "multipleDocuments",
  () => Pending.done({ files: [] }),
  (dto, store) => Pending.done(new MultipleDocumentUpdloadDtoValidator(dto, store.config, true, false)),
  getKey("project", projectId)
);

export const getClaimDetailDocumentEditor = ({ partnerId, periodId, costCategoryId }: ClaimDetailKey, config: { maxFileSize: number, maxUploadFileCount: number }) => editorStoreHelper<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>(
  "multipleDocuments",
  () => Pending.done({ files: [] }),
  (dto) => Pending.done(new MultipleDocumentUpdloadDtoValidator(dto, config, true, false)),
  getKey("claim", "details", partnerId, periodId, costCategoryId)
);

export const getClaimDetailDocumentDeleteEditorStoreInfo = ({ partnerId, periodId, costCategoryId }: ClaimDetailKey, documents: DocumentSummaryDto[]) => {
  return getDocumentsDeleteEditor(getKey("claimDetail", partnerId, periodId, costCategoryId), documents);
};

export const getProjectChangeRequestDocumentOrItemDocumentDeleteEditorStoreInfo = (projectChangeRequestIdOrItemId: string, documents: DocumentSummaryDto[]) => {
  return getDocumentsDeleteEditor(getKey("projectChangeRequestItem", projectChangeRequestIdOrItemId), documents);
};

export const getClaimDetailDocumentDeleteEditor = (state: RootState, { projectId, partnerId, periodId, costCategoryId }: ClaimDetailKey): IEditorSelector<DocumentSummaryDto[], Results<DocumentSummaryDto[]>> => {
  const documents = getClaimDetailDocuments(partnerId, periodId, costCategoryId).get(state).data;
  return getClaimDetailDocumentDeleteEditorStoreInfo({ projectId, partnerId, periodId, costCategoryId }, documents || []);
};

export const getProjectChangeRequestDocumentOrItemDocumentDeleteEditor = (state: RootState, projectChangeRequestIdOrItemId: string): IEditorSelector<DocumentSummaryDto[], Results<DocumentSummaryDto[]>> => {
  const documents = getProjectChangeRequestDocumentsOrItemDocuments(projectChangeRequestIdOrItemId).get(state).data;
  return getProjectChangeRequestDocumentOrItemDocumentDeleteEditorStoreInfo(projectChangeRequestIdOrItemId, documents || []);
};

export const getClaimDocumentEditor = ({ partnerId, periodId }: ClaimKey, maxFileSize: number) => editorStoreHelper<DocumentUploadDto, DocumentUploadDtoValidator>(
  documentStore,
  () => Pending.done({ file: null }),
  (dto) => Pending.done(new DocumentUploadDtoValidator(dto, maxFileSize, false)),
  getKey("claim", partnerId, periodId)
);

const getDocumentsDeleteEditor = (key: string, documents: DocumentSummaryDto[]) => editorStoreHelper<DocumentSummaryDto[], Results<DocumentSummaryDto[]>>(
  documentSummaryEditorStore,
  () => Pending.done(documents),
  () => Pending.done(new Results(documents, false)),
  key
);

function getIarDocumentFromClaim(projectId: string, claim: ClaimDto|null|undefined, state: RootState): Pending<IEditorStore<DocumentUploadDto, DocumentUploadDtoValidator> | null> {
  if (!claim) {
    return new Pending(LoadingStatus.Done, null);
  }
  return getClaimDocumentEditor({ projectId, partnerId: claim.partnerId, periodId: claim.periodId }, state.config.maxFileSize).get(state, dto => dto.description = DocumentDescription.IAR);
}

export const getCurrentClaimIarDocumentsEditor = (state: RootState, projectId: string, partnerId: string): Pending<IEditorStore<DocumentUploadDto, DocumentUploadDtoValidator> | null> => {
  return getCurrentClaim(state, partnerId).chain(claim => getIarDocumentFromClaim(projectId, claim, state));
};

export const getCurrentClaimIarDocumentsEditorForLeadPartner = (state: RootState, projectId: string): Pending<IEditorStore<DocumentUploadDto, DocumentUploadDtoValidator> | null> => {
  return getLeadPartnerCurrentClaim(state, projectId).chain(claim => getIarDocumentFromClaim(projectId, claim, state));
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
