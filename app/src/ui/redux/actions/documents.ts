import * as Actions from "@ui/redux/actions/common";
import * as Selectors from "@ui/redux/selectors";
import { ApiClient } from "@ui/apiClient";
import { Results } from "@ui/validation/results";
import { DocumentUploadDtoValidator, MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { LoadingStatus } from "@shared/pending";
import { DocumentDescription } from "@framework/constants";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { getProjectChangeRequestDocumentsOrItemDocuments, getProjectDocuments } from "@ui/redux/selectors";

type uploadProjectDocumentActions = Actions.AsyncThunk<void, Actions.DataLoadAction | Actions.EditorAction | Actions.messageSuccess | Actions.removeMessages>;

export function loadClaimDetailDocuments(claimDetailKey: ClaimDetailKey) {
  return Actions.conditionalLoad(
    Selectors.getClaimDetailDocuments(claimDetailKey.partnerId, claimDetailKey.periodId, claimDetailKey.costCategoryId),
    params => ApiClient.documents.getClaimDetailDocuments({ claimDetailKey, ...params })
  );
}

export function loadIarDocuments(projectId: string, partnerId: string, periodId: number) {
  return Actions.conditionalLoad(
    Selectors.getClaimDocuments(partnerId, periodId),
    params => ApiClient.documents.getClaimDocuments({ projectId, partnerId, periodId, description: DocumentDescription.IAR, ...params })
  );
}

export function updateProjectChangeRequestDocumentOrItemDocumentEditor(projectChangeRequestIdOrItemId: string, dto: MultipleDocumentUploadDto, showErrors: boolean = false): Actions.SyncThunk<Results<MultipleDocumentUploadDto>, Actions.UpdateEditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = Selectors.getProjectChangeRequestDocumentOrItemDocumentEditor(projectChangeRequestIdOrItemId);
    const current = state.editors[selector.store][selector.key];
    const errors = showErrors || current && current.validator.showValidationErrors || false;
    const validator = new MultipleDocumentUpdloadDtoValidator(dto, state.config, true, errors);
    dispatch(Actions.updateEditorAction(selector.key, selector.store, dto, validator));

    return validator;
  };
}

export function loadProjectChangeRequestDocumentsOrItemDocuments(projectId: string, projectChangeRequestIdOrItemId: string) {
  return Actions.conditionalLoad(
    Selectors.getProjectChangeRequestDocumentsOrItemDocuments(projectChangeRequestIdOrItemId),
    params => ApiClient.documents.getProjectChangeRequestDocumentsOrItemDocuments({ projectId, projectChangeRequestIdOrItemId, ...params })
  );
}

export function loadProjectDocuments(projectId: string) {
  return Actions.conditionalLoad(
    Selectors.getProjectDocuments(projectId),
    params => ApiClient.documents.getProjectDocuments({ projectId, ...params })
  );
}

export function updateProjectDocumentEditor(projectId: string, dto: MultipleDocumentUploadDto, showErrors: boolean = false): Actions.SyncThunk<Results<MultipleDocumentUploadDto>, Actions.UpdateEditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = Selectors.getProjectDocumentEditor(projectId);
    const current = state.editors[selector.store][selector.key];
    const errors = showErrors || current && current.validator.showValidationErrors || false;
    const validator = new MultipleDocumentUpdloadDtoValidator(dto, state.config, true, errors);
    dispatch(Actions.updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function uploadProjectChangeRequestDocumentOrItemDocument(projectId: string, projectChangeRequestIdOrItemId: string, dto: MultipleDocumentUploadDto, onComplete: () => void, message: string): uploadProjectDocumentActions {
  return (dispatch, getState) => {
    dispatch(Actions.removeMessages());

    const state = getState();
    const selector = Selectors.getProjectChangeRequestDocumentOrItemDocumentEditor(projectChangeRequestIdOrItemId);
    const validation = updateProjectChangeRequestDocumentOrItemDocumentEditor(projectChangeRequestIdOrItemId, dto, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    dispatch(Actions.handleEditorSubmit(selector.key, selector.store, dto, validation));

    return ApiClient.documents.uploadProjectChangeRequestDocumentOrItemDocument({ projectId, projectChangeRequestIdOrItemId, documents: dto, user: state.user })
      .then(() => {
        const dataStoreSelector = getProjectChangeRequestDocumentsOrItemDocuments(projectChangeRequestIdOrItemId);
        dispatch(Actions.dataLoadAction(dataStoreSelector.key, dataStoreSelector.store, LoadingStatus.Stale, undefined));
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        dispatch(Actions.messageSuccess(message));
        scrollToTheTopSmoothly();
        onComplete();
      })
      .catch((e) => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation, error: e }));
      });
  };
}

export function uploadProjectDocument(projectId: string, dto: MultipleDocumentUploadDto, onComplete: () => void, message: string): uploadProjectDocumentActions {
  return (dispatch, getState) => {
    dispatch(Actions.removeMessages());

    const state = getState();
    const selector = Selectors.getProjectDocumentEditor(projectId);
    const validation = updateProjectDocumentEditor(projectId, dto, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    dispatch(Actions.handleEditorSubmit(selector.key, selector.store, dto, validation));

    return ApiClient.documents.uploadProjectDocument({ projectId, documents: dto, user: state.user })
      .then(() => {
        const dataStoreSelector = getProjectDocuments(projectId);
        dispatch(Actions.dataLoadAction(dataStoreSelector.key, dataStoreSelector.store, LoadingStatus.Stale, undefined));
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        dispatch(Actions.messageSuccess(message));
        scrollToTheTopSmoothly();
        onComplete();
      })
      .catch(e => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation, error: e }));
      });
  };
}

// update editor with validation
export function updateClaimDetailDocumentEditor(claimDetailKey: ClaimDetailKey, dto: MultipleDocumentUploadDto, showErrors?: boolean): Actions.SyncThunk<Results<MultipleDocumentUploadDto>, Actions.UpdateEditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = Selectors.getClaimDetailDocumentEditor(claimDetailKey, state.config);
    if (showErrors === null || showErrors === undefined) {
      const current = state.editors[selector.store][selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }
    const validator = new MultipleDocumentUpdloadDtoValidator(dto, state.config, true, showErrors);
    dispatch(Actions.updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function uploadClaimDetailDocument(claimDetailKey: ClaimDetailKey, dto: MultipleDocumentUploadDto, onComplete: () => void, message: string
): uploadProjectDocumentActions {
  return (dispatch, getState) => {
    dispatch(Actions.removeMessages());

    const state = getState();
    const selector = Selectors.getClaimDetailDocumentEditor(claimDetailKey, state.config);
    const docsSelector = Selectors.getClaimDetailDocuments(claimDetailKey.partnerId, claimDetailKey.periodId, claimDetailKey.costCategoryId);
    const validation = updateClaimDetailDocumentEditor(claimDetailKey, dto, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    dispatch(Actions.handleEditorSubmit(selector.key, selector.store, dto, validation));

    // tslint:disable: no-identical-functions
    return ApiClient.documents.uploadClaimDetailDocuments({ claimDetailKey, documents: dto, user: state.user })
      .then(() => {
        dispatch(Actions.dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        dispatch(Actions.messageSuccess(message));
        scrollToTheTopSmoothly();
        onComplete();
      }).catch((e: any) => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation, error: e }));
      });
  };
}

// update editor with validation
export function updateClaimDocumentEditor(claimKey: ClaimKey, dto: DocumentUploadDto, showErrors?: boolean): Actions.SyncThunk<Results<DocumentUploadDto>, Actions.UpdateEditorAction | Actions.removeMessages> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = Selectors.getClaimDocumentEditor(claimKey, state.config.maxFileSize);
    if (showErrors === null || showErrors === undefined) {
      const current = state.editors[selector.store][selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }
    const validator = new DocumentUploadDtoValidator(dto, state.config.maxFileSize, showErrors);
    dispatch(Actions.updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function uploadClaimDocument(claimKey: ClaimKey, dto: DocumentUploadDto, onComplete: () => void): uploadProjectDocumentActions {
  return (dispatch, getState) => {
    dispatch(Actions.removeMessages());

    const state = getState();
    const selector = Selectors.getClaimDocumentEditor(claimKey, state.config.maxFileSize);
    const docsSelector = Selectors.getClaimDocuments(claimKey.partnerId, claimKey.periodId);
    const claimsSelector = Selectors.findClaimsByPartner(claimKey.partnerId);
    const validation = updateClaimDocumentEditor(claimKey, dto, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    // Uploading an IAR Document when the claim status is Awaiting IAR will update the status so the claims need to be reloaded.
    dispatch(Actions.handleEditorSubmit(selector.key, selector.store, dto, validation));
    dispatch(Actions.dataLoadAction(claimsSelector.key, claimsSelector.store, LoadingStatus.Stale, undefined));
    dispatch(Actions.dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));

    return ApiClient.documents.uploadClaimDocument({ claimKey, document: dto, user: state.user })
      .then(() => {
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        onComplete();
      }).catch((e: any) => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation, error: e }));
      });
  };
}

export function uploadLeadPartnerClaimDocument(claimKey: ClaimKey, dto: DocumentUploadDto, onComplete: () => void): uploadProjectDocumentActions {
  return (dispatch, getState) => {
    dispatch(Actions.removeMessages());

    const state = getState();
    const selector = Selectors.getClaimDocumentEditor(claimKey, state.config.maxFileSize);
    const docsSelector = Selectors.getClaimDocuments(claimKey.partnerId, claimKey.periodId);
    const claimsSelector = Selectors.findPartnersByProject(claimKey.projectId);
    const validation = updateClaimDocumentEditor(claimKey, dto, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    // Uploading an IAR Document when the claim status is Awaiting IAR will update the status so the claims need to be reloaded.
    dispatch(Actions.handleEditorSubmit(selector.key, selector.store, dto, validation));
    dispatch(Actions.dataLoadAction(claimsSelector.key, claimsSelector.store, LoadingStatus.Stale, undefined));
    dispatch(Actions.dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));

    return ApiClient.documents.uploadClaimDocument({ claimKey, document: dto, user: state.user })
      .then(() => {
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        onComplete();
      }).catch((e: any) => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation, error: e }));
      });
  };
}

export function deleteProjectChangeRequestDocumentOrItemDocument(projectId: string, projectChangeRequestIdOrItemId: string, dto: DocumentSummaryDto, onComplete: () => void): Actions.AsyncThunk<void> {
  return (dispatch, getState) => {
    dispatch(Actions.removeMessages());

    const state = getState();
    const docsSelector = Selectors.getProjectChangeRequestDocumentsOrItemDocuments(projectChangeRequestIdOrItemId);
    const selector = Selectors.getProjectChangeRequestDocumentOrItemDocumentDeleteEditor(state, projectChangeRequestIdOrItemId);

    dispatch(Actions.handleEditorSubmit(selector.key, selector.store, dto, null));
    dispatch(Actions.dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));

    return ApiClient.documents.deleteProjectChangeRequestDocumentOrItemDocument({ documentId: dto.id, projectId, projectChangeRequestIdOrItemId, user: state.user })
      .then(() => {
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        onComplete();
      }).catch((e) => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation: null, error: e }));
      });
  };
}

export function deleteClaimDetailDocument(claimDetailKey: ClaimDetailKey, dto: DocumentSummaryDto, onComplete: () => void): Actions.AsyncThunk<void> {
  return (dispatch, getState) => {
    dispatch(Actions.removeMessages());

    const state = getState();
    const docsSelector = Selectors.getClaimDetailDocuments(claimDetailKey.partnerId, claimDetailKey.periodId, claimDetailKey.costCategoryId);
    const selector = Selectors.getClaimDetailDocumentDeleteEditor(state, claimDetailKey);

    dispatch(Actions.handleEditorSubmit(selector.key, selector.store, dto, null));
    dispatch(Actions.dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));

    return ApiClient.documents.deleteClaimDetailDocument({ documentId: dto.id, claimDetailKey, user: state.user })
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

    dispatch(Actions.removeMessages());
    dispatch(Actions.handleEditorSubmit(selector.key, selector.store, dto, null));
    dispatch(Actions.dataLoadAction(docsSelector.key, docsSelector.store, LoadingStatus.Stale, undefined));

    return ApiClient.documents.deleteClaimDocument({ documentId: dto.id, claimKey, user: state.user })
      .then(() => {
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        onComplete();
      }).catch((e: any) => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation: null, error: e }));
      });
  };
}
