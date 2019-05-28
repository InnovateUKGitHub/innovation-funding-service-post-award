import * as Actions from "@ui/redux/actions/common";
import * as Selectors from "@ui/redux/selectors";
import { ApiClient } from "@ui/apiClient";
import { Results } from "@ui/validation/results";
import { DocumentUploadValidator } from "@ui/validators";
import { LoadingStatus } from "@shared/pending";
import { DocumentDescription } from "@framework/constants";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";

type uploadProjectDocumentActions = Actions.AsyncThunk<void, Actions.DataLoadAction | Actions.EditorAction | Actions.messageSuccess>;

export function loadClaimDetailDocuments(projectId: string, partnerId: string, periodId: number, costCategoryId: string) {
  return Actions.conditionalLoad(
    Selectors.getClaimDetailDocuments(partnerId, periodId, costCategoryId),
    params => ApiClient.documents.getClaimDetailDocuments({ claimDetailKey: {projectId, partnerId, periodId, costCategoryId}, ...params})
  );
}

export function loadIarDocuments(partnerId: string, periodId: number) {
  return Actions.conditionalLoad(
    Selectors.getClaimDocuments(partnerId, periodId),
    params => ApiClient.documents.getClaimDocuments({ partnerId, periodId, description: DocumentDescription.IAR, ...params})
  );
}

export function loadProjectDocuments(projectId: string) {
  return Actions.conditionalLoad(
    Selectors.getProjectDocuments(projectId),
    params => ApiClient.documents.getProjectDocuments({projectId, ...params})
  );
}

export function updateProjectDocumentEditor(projectId: string, dto: DocumentUploadDto, showErrors: boolean = false): Actions.SyncThunk<Results<DocumentUploadDto>, Actions.UpdateEditorAction> {
  return (dispatch, getState) => {
    const selector = Selectors.getProjectDocumentEditor(projectId);
    const state = getState();
    const current = state.editors[selector.store][selector.key];
    const errors = showErrors || current && current.validator.showValidationErrors || false;
    const validator = new DocumentUploadValidator(dto, errors);
    dispatch(Actions.updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function uploadProjectDocument(projectId: string, dto: DocumentUploadDto, onComplete: () => void, message: string): uploadProjectDocumentActions {
  return (dispatch, getState) => {
    const state = getState();
    const selector = Selectors.getProjectDocumentEditor(projectId);
    const validation = updateProjectDocumentEditor(projectId, dto, true)(dispatch, getState, null);

    if(!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    dispatch(Actions.handleEditorSubmit(selector.key, selector.store));
    dispatch(Actions.dataLoadAction(selector.key, selector.store, LoadingStatus.Stale, undefined));

    return ApiClient.documents.uploadProjectDocument({ projectId, file: dto.file!, user: state.user })
      .then(() => {
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        dispatch(Actions.messageSuccess(message));
        onComplete();
      })
      .catch(e => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation, error: e }));
      });
  };
}

// update editor with validation
export function updateClaimDetailDocumentEditor(claimDetailKey: ClaimDetailKey, dto: DocumentUploadDto, showErrors?: boolean): Actions.SyncThunk<Results<DocumentUploadDto>, Actions.UpdateEditorAction> {
  return (dispatch, getState) => {
    const selector = Selectors.getClaimDetailDocumentEditor(claimDetailKey);
    const state = getState();
    if (showErrors === null || showErrors === undefined) {
      const current = state.editors[selector.store][selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }
    const validator = new DocumentUploadValidator(dto, showErrors);
    dispatch(Actions.updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function uploadClaimDetailDocument(claimDetailKey: ClaimDetailKey, dto: DocumentUploadDto, onComplete: () => void, message: string
): uploadProjectDocumentActions {
  return (dispatch, getState) => {
    const state = getState();
    const selector = Selectors.getClaimDetailDocumentEditor(claimDetailKey);
    const docsSelector = Selectors.getClaimDetailDocuments(claimDetailKey.partnerId, claimDetailKey.periodId, claimDetailKey.costCategoryId);
    const validation = updateClaimDetailDocumentEditor(claimDetailKey, dto, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    dispatch(Actions.handleEditorSubmit(selector.key, selector.store));
    dispatch(Actions.dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));

    // tslint:disable: no-identical-functions
    return ApiClient.documents.uploadClaimDetailDocument({ claimDetailKey, file: dto.file!, user: state.user })
      .then(() => {
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        dispatch(Actions.messageSuccess(message));
        onComplete();
      }).catch((e: any) => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation, error: e }));
      });
  };
}

// update editor with validation
export function updateClaimDocumentEditor(claimKey: ClaimKey, dto: DocumentUploadDto, showErrors?: boolean): Actions.SyncThunk<Results<DocumentUploadDto>, Actions.UpdateEditorAction> {
  return (dispatch, getState) => {
    const selector = Selectors.getClaimDocumentEditor(claimKey, dto.description);
    const state = getState();
    if (showErrors === null || showErrors === undefined) {
      const current = state.editors[selector.store][selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }
    const validator = new DocumentUploadValidator(dto, showErrors);
    dispatch(Actions.updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function uploadClaimDocument(claimKey: ClaimKey, dto: DocumentUploadDto, onComplete: () => void): uploadProjectDocumentActions {
  return (dispatch, getState) => {
    const state = getState();
    const selector = Selectors.getClaimDocumentEditor(claimKey, dto.description);
    const docsSelector = Selectors.getClaimDocuments(claimKey.partnerId, claimKey.periodId);
    const claimsSelector = Selectors.findClaimsByPartner(claimKey.partnerId);
    const validation = updateClaimDocumentEditor(claimKey, dto, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    // Uploading an IAR Document when the claim status is Awaiting IAR will update the status so the claims need to be reloaded.
    dispatch(Actions.handleEditorSubmit(selector.key, selector.store));
    dispatch(Actions.dataLoadAction(claimsSelector.key, claimsSelector.store, LoadingStatus.Stale, undefined));
    dispatch(Actions.dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));

    return ApiClient.documents.uploadClaimDocument({ claimKey, file: dto.file!, description: dto.description, user: state.user })
      .then(() => {
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        onComplete();
      }).catch((e: any) => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation, error: e }));
      });
  };
}

export function deleteClaimDetailDocument(claimDetailKey: ClaimDetailKey, dto: DocumentSummaryDto, onComplete: () => void): Actions.AsyncThunk<void> {
  return (dispatch, getState) => {
    const state = getState();
    const docsSelector = Selectors.getClaimDetailDocuments(claimDetailKey.partnerId, claimDetailKey.periodId, claimDetailKey.costCategoryId);
    const selector = Selectors.getClaimDetailDocumentDeleteEditor(state, claimDetailKey);

    dispatch(Actions.handleEditorSubmit(selector.key, selector.store));
    dispatch(Actions.dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));

    return ApiClient.documents.deleteDocument({ documentId: dto.id, user: state.user })
      .then(() => {
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        onComplete();
      }).catch((e: any) => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation: null, error: e }));
      });
  };
}

export function deleteClaimDocument(claimKey: ClaimKey, dto: DocumentSummaryDto, onComplete: () => void): Actions.AsyncThunk<void> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = Selectors.getDocumentDeleteEditor(dto);
    const docsSelector = Selectors.getClaimDocuments(claimKey.partnerId, claimKey.periodId);

    dispatch(Actions.handleEditorSubmit(selector.key, selector.store));
    dispatch(Actions.dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));

    return ApiClient.documents.deleteDocument({documentId: dto.id, user: state.user})
      .then(() => {
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        dispatch(Actions.removeMessages());
        onComplete();
      }).catch((e: any) => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation: null, error: e }));
      });
  };
}
