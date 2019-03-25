import { ApiClient } from "../../apiClient";
import {
  AsyncThunk,
  conditionalLoad,
  dataLoadAction,
  DataLoadAction,
  EditorAction,
  handleEditorError,
  handleEditorSuccess,
  SyncThunk,
  updateEditorAction,
  UpdateEditorAction
} from "./common";
import {
  getClaimDetailDocumentEditor,
  getClaimDetailDocuments,
  getClaimDocumentEditor,
  getClaimDocuments,
  getProjectDocuments,
} from "../selectors/documents";
import { LoadingStatus } from "../../../shared/pending";
import { Results } from "../../validation/results";
import {DocumentUploadValidator} from "../../validators/documentUploadValidator";
import {DocumentDescription} from "../../../types/constants";
import { findClaimsByPartner } from "../selectors";
import { scrollToTheTop } from "../../../util/windowHelpers";
import * as Selectors from "../selectors";

export function loadClaimDetailDocuments(partnerId: string, periodId: number, costCategoryId: string) {
  return conditionalLoad(
    getClaimDetailDocuments(partnerId, periodId, costCategoryId),
    params => ApiClient.documents.getClaimDetailDocuments({ claimDetailKey: {partnerId, periodId, costCategoryId}, ...params})
  );
}

export function loadIarDocuments(partnerId: string, periodId: number) {
  return conditionalLoad(
    getClaimDocuments(partnerId, periodId),
    params => ApiClient.documents.getClaimDocuments({ partnerId, periodId, description: DocumentDescription.IAR, ...params})
  );
}

export function loadProjectDocuments(projectId: string) {
  return conditionalLoad(
    getProjectDocuments(projectId),
    params => ApiClient.documents.getProjectDocuments({projectId, ...params})
  );
}

// update editor with validation
export function updateClaimDetailDocumentEditor(claimDetailKey: ClaimDetailKey, dto: DocumentUploadDto, showErrors?: boolean): SyncThunk<Results<DocumentUploadDto>, UpdateEditorAction> {
  return (dispatch, getState) => {
    const selector =  getClaimDetailDocumentEditor(claimDetailKey);
    const state = getState();
    if (showErrors === null || showErrors === undefined) {
      const current = state.editors[selector.store][selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }
    const validator = new DocumentUploadValidator(dto, showErrors);
    dispatch(updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function uploadClaimDetailDocument(claimDetailKey: ClaimDetailKey, dto: DocumentUploadDto, onComplete: () => void): AsyncThunk<void, DataLoadAction | EditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getClaimDetailDocumentEditor(claimDetailKey);
    const docsSelector = getClaimDetailDocuments(claimDetailKey.partnerId, claimDetailKey.periodId, claimDetailKey.costCategoryId);
    const validation = updateClaimDetailDocumentEditor(claimDetailKey, dto, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTop();
      return Promise.resolve();
    }

    dispatch(dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));

    return ApiClient.documents.uploadClaimDetailDocument({ claimDetailKey, file: dto.file!, user: state.user })
      .then(() => {
        dispatch(handleEditorSuccess(selector.key, selector.store));
        onComplete();
      }).catch((e: any) => {
        dispatch(handleEditorError({ id: selector.key, store: selector.store, dto, validation, error: e }));
      });
  };
}

// update editor with validation
export function updateClaimDocumentEditor(claimKey: ClaimKey, dto: DocumentUploadDto, showErrors?: boolean): SyncThunk<Results<DocumentUploadDto>, UpdateEditorAction> {
  return (dispatch, getState) => {
    const selector =  getClaimDocumentEditor(claimKey, dto.description);
    const state = getState();
    if (showErrors === null || showErrors === undefined) {
      const current = state.editors[selector.store][selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }
    const validator = new DocumentUploadValidator(dto, showErrors);
    dispatch(updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function uploadClaimDocument(claimKey: ClaimKey, dto: DocumentUploadDto, onComplete: () => void): AsyncThunk<void, DataLoadAction | EditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getClaimDocumentEditor(claimKey, dto.description);
    const docsSelector = getClaimDocuments(claimKey.partnerId, claimKey.periodId);
    const claimsSelector = findClaimsByPartner(claimKey.partnerId);
    const validation = updateClaimDocumentEditor(claimKey, dto, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTop();
      return Promise.resolve();
    }

    // Uploading an IAR Document when the claim status is Awaiting IAR will update the status so the claims need to be reloaded.
    dispatch(dataLoadAction(claimsSelector.key, claimsSelector.store, LoadingStatus.Stale, undefined));
    dispatch(dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));

    return ApiClient.documents.uploadClaimDocument({ claimKey, file: dto.file!, description: dto.description, user: state.user })
      .then(() => {
        dispatch(handleEditorSuccess(selector.key, selector.store));
        onComplete();
      }).catch((e: any) => {
        dispatch(handleEditorError({ id: selector.key, store: selector.store, dto, validation, error: e }));
      });
  };
}

export function deleteClaimDetailDocument(claimDetailKey: ClaimDetailKey, dto: DocumentSummaryDto, onComplete: () => void): AsyncThunk<void> {
  return (dispatch, getState) => {
    const state = getState();
    const docsSelector = getClaimDetailDocuments(claimDetailKey.partnerId, claimDetailKey.periodId, claimDetailKey.costCategoryId);
    const selector = Selectors.getClaimDetailDocumentDeleteEditor(state, claimDetailKey);
    dispatch(dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));

    return ApiClient.documents.deleteDocument({ documentId: dto.id, user: state.user })
      .then(() => {
        dispatch(handleEditorSuccess(selector.key, selector.store));
        onComplete();
      }).catch((e: any) => {
        dispatch(handleEditorError({ id: selector.key, store: selector.store, dto, validation: null, error: e }));
      });
  };
}

export function deleteClaimDocument(claimKey: ClaimKey, dto: DocumentSummaryDto, onComplete: () => void): AsyncThunk<void> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = Selectors.getDocumentDeleteEditor(dto);
    const docsSelector = getClaimDocuments(claimKey.partnerId, claimKey.periodId);
    dispatch(dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));
    return ApiClient.documents.deleteDocument({documentId: dto.id, user: state.user})
      .then(() => {
        dispatch(handleEditorSuccess(selector.key, selector.store));
        onComplete();
      }).catch((e: any) => {
        dispatch(handleEditorError({ id: selector.key, store: selector.store, dto, validation: null, error: e }));
      });
  };
}
