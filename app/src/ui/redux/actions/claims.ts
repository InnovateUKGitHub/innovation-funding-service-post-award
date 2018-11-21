import { ApiClient } from "../../apiClient";
import { ClaimDtoValidator } from "../../validators";
import { LoadingStatus } from "../../../shared/pending";
import { AsyncThunk, conditionalLoad, dataLoadAction, DataLoadAction, handleError, SyncThunk, updateEditorAction, UpdateEditorAction } from "./common";
import { findClaimsByPartner, getClaim, getClaimEditor, getCurrentClaim } from "../selectors";
import { ClaimDto } from "../../../types";
import { loadIarDocuments } from ".";

export function loadClaim(partnerId: string, periodId: number) {
  return conditionalLoad(getClaim(partnerId, periodId), params => ApiClient.claims.get({partnerId, periodId, ...params}));
}

// update editor with validation
export function validateClaim(partnerId: string, periodId: number, dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: CostCategoryDto[], showErrors?: boolean): SyncThunk<ClaimDtoValidator, UpdateEditorAction> {
  return (dispatch, getState) => {
    const selector = getClaimEditor(partnerId, periodId);
    const state = getState();
    if (showErrors === null || showErrors === undefined) {
      const current = state.editors[selector.store][selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }
    const validator = new ClaimDtoValidator(dto, details, costCategories, showErrors);
    dispatch(updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function saveClaim(partnerId: string, periodId: number, claim: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: CostCategoryDto[], onComplete: () => void): AsyncThunk<void, DataLoadAction | UpdateEditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getClaimEditor(partnerId, periodId);
    const validation = validateClaim(partnerId, periodId, claim, details, costCategories, true)(dispatch, getState, null);

    if (!validation.isValid) {
      return Promise.resolve();
    }

    // send a loading action with undefined as it will just update the status
    dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Loading, undefined));

    return ApiClient.claims.update({partnerId, periodId, claim, user: state.user}).then((result) => {
      dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Done, result));
      onComplete();
    }).catch((e) => {
      dispatch(handleError({ id: selector.key, store: selector.store, dto: claim, validation, error: e }));
    });
  };
}

export function loadClaimsForPartner(partnerId: string) {
  return conditionalLoad(findClaimsByPartner(partnerId), params => ApiClient.claims.getAllByPartnerId({partnerId, ...params}));
}

export function loadClaimsAndDocuments(partnerId: string): AsyncThunk<void, DataLoadAction> {
  return (dispatch, getState) => loadClaimsForPartner(partnerId)(dispatch, getState, null).then(() => {
    const claim = getCurrentClaim(getState(), partnerId).data;
    if (claim) {
      loadIarDocuments(partnerId, claim.periodId)(dispatch, getState, null);
    }
  });
}
