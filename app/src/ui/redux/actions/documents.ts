import { ApiClient } from "../../apiClient";
import {
  AsyncThunk,
  conditionalLoad, dataLoadAction,
  DataLoadAction, handleError, ResetEditorAction, resetEditorAction,
  SyncThunk,
  updateEditorAction,
  UpdateEditorAction
} from "./common";
import { getClaimDetailDocumentEditor, getClaimDetailDocuments } from "../selectors/documents";
import { LoadingStatus } from "../../../shared/pending";
import { Results } from "../../validation/results";

export function loadClaimDetailDocuments(partnerId: string, periodId: number, costCategoryId: string) {
  return conditionalLoad(
    getClaimDetailDocuments(partnerId, periodId, costCategoryId),
    params => ApiClient.documents.getClaimDetailDocuments({ claimDetailKey: {partnerId, periodId, costCategoryId}, ...params})
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
    const validator = new Results<ClaimDetailDocumentDto>(dto, showErrors);
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

    // send a loading action with undefined as it will just update the status
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
