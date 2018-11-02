import { ApiClient } from "../../apiClient";
import { ClaimDetailsSummaryDto, ClaimDto, CostCategoryDto } from "../../models";
import { ClaimDtoValidator } from "../../validators";
import { LoadingStatus } from "../../../shared/pending";
import { AsyncThunk, conditionalLoad, dataLoadAction, DataLoadAction, handleError, SyncThunk, updateEditorAction, UpdateEditorAction } from "./common";
import { findClaimsByPartner, getClaim, getClaimEditor } from "../selectors";

export function loadClaim(partnerId: string, periodId: number) {
  const selector = getClaim(partnerId, periodId);
  return conditionalLoad(selector.key, selector.store, params => ApiClient.claims.get({partnerId, periodId, ...params}));
}

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
  const selector = findClaimsByPartner(partnerId);
  return conditionalLoad(selector.key, selector.store, params => ApiClient.claims.getAllByPartnerId({partnerId, ...params}));
}
