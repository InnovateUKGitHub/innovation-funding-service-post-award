import {conditionalLoad, dataLoadAction, DataLoadAction} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { getClaim, getClaimEditor } from "../selectors/claim";
import {ClaimDetailsSummaryDto, ClaimDto, CostCategoryDto} from "../../models";
import {AsyncThunk, SyncThunk} from "./common";
import {ClaimDtoValidator} from "../../validators/claimDtoValidator";
import {updateEditorAction, UpdateEditorAction} from "./editorActions";
import {LoadingStatus} from "../../../shared/pending";

export function loadClaim(partnerId: string, periodId: number) {
  const selector = getClaim(partnerId, periodId);
  return conditionalLoad(
    selector.key,
    selector.store!,
    () => ApiClient.claims.get(partnerId, periodId)
  );
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

export function saveClaim(partnerId: string, periodId: number, dto: ClaimDto, details: ClaimDetailsSummaryDto[], costCategories: CostCategoryDto[], onComplete: () => void): AsyncThunk<void, DataLoadAction | UpdateEditorAction> {
  return (dispatch, getState) => {
    const selector = getClaimEditor(partnerId, periodId);
    const validation = validateClaim(partnerId, periodId, dto, details, costCategories, true)(dispatch, getState, null);

    if (!validation.isValid()) {
      return Promise.resolve();
    }

    return ApiClient.claims.update(partnerId, periodId, dto).then((result) => {
      dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Done, result));
      onComplete();
    }).catch((e) => {
      dispatch(updateEditorAction(selector.key, selector.store, dto, validation, e));
    });
  };
}
