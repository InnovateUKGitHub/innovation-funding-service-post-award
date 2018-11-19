import { ApiClient } from "../../apiClient";
import { AsyncThunk, conditionalLoad, dataLoadAction, DataLoadAction, handleError, ResetEditorAction, resetEditorAction, SyncThunk, updateEditorAction, UpdateEditorAction } from "./common";
import {getClaimDetailDocumentEditor, getClaimDetailDocuments, getClaimDocuments} from "../selectors/documents";
import { LoadingStatus } from "../../../shared/pending";
import { Results } from "../../validation/results";
import {DocumentUploadValidator} from "../../validators/documentUploadValidator";

export function loadClaimDetailDocuments(partnerId: string, periodId: number, costCategoryId: string) {
  return conditionalLoad(
    getClaimDetailDocuments(partnerId, periodId, costCategoryId),
    params => ApiClient.documents.getClaimDetailDocuments({ claimDetailKey: {partnerId, periodId, costCategoryId}, ...params})
  );
}

export function loadIarDocuments(partnerId: string, periodId: number) {
  return conditionalLoad(
    getClaimDocuments(partnerId, periodId),
    params => ApiClient.documents.getClaimDocuments({ partnerId, periodId, ...params})
  );
}

// update editor with validation
export function updateClaimDetailDocumentEditor(claimDetailKey: ClaimDetailKey, dto: ClaimDetailDocumentDto, showErrors?: boolean): SyncThunk<Results<ClaimDetailDocumentDto>, UpdateEditorAction> {
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

export function uploadClaimDetailDocument(claimDetailKey: ClaimDetailKey, dto: ClaimDetailDocumentDto, onComplete: () => void): AsyncThunk<void, DataLoadAction | UpdateEditorAction | ResetEditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getClaimDetailDocumentEditor(claimDetailKey);
    const docsSelector = getClaimDetailDocuments(claimDetailKey.partnerId, claimDetailKey.periodId, claimDetailKey.costCategoryId);
    const validation = updateClaimDetailDocumentEditor(claimDetailKey, dto, true)(dispatch, getState, null);

    if (!validation.isValid) {
      return Promise.resolve();
    }

    dispatch(dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));

    return ApiClient.documents.uploadClaimDetailDocument({ claimDetailKey, file: dto.file!, user: state.user })
      .then(() => {
        dispatch(resetEditorAction(selector.key, selector.store));
        onComplete();
      }).catch((e: any) => {
        dispatch(handleError({ id: selector.key, store: selector.store, dto, validation, error: e }));
      });
  };
}

export function deleteClaimDetailDocument(claimDetailKey: ClaimDetailKey, dto: DocumentSummaryDto, onComplete: () => void): AsyncThunk<void> {
  return (dispatch, getState) => {
    const state = getState();
    const docsSelector = getClaimDetailDocuments(claimDetailKey.partnerId, claimDetailKey.periodId, claimDetailKey.costCategoryId);
    dispatch(dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));
    return ApiClient.documents.deleteDocument({ documentId: dto.id, user: state.user })
      .then(() => {
        onComplete();
      }).catch((e: any) => {
        console.log(e);
        // TODO handle error
      });
  };
}
