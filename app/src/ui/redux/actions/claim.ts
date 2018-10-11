import {conditionalLoad, dataLoadAction, DataLoadAction} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { claimStore, getClaim } from "../selectors/claim";
import {ClaimDto} from "../../models";
import {AsyncThunk, SyncThunk} from "./common";
import {ClaimDtoValidator} from "../../validators/claimDtoValidator";
import {updateEditorAction, UpdateEditorAction} from "./editorActions";
import {LoadingStatus} from "../../../shared/pending";

export function loadClaim(partnerId: string, periodId: number) {
  return conditionalLoad(
    getClaim(partnerId, periodId).key,
    claimStore,
    () => ApiClient.claims.get(partnerId, periodId)
  );
}

export function validateClaim(partnerId: string, periodId: number, dto: ClaimDto, showErrors?: boolean): SyncThunk<ClaimDtoValidator, UpdateEditorAction> {
  return (dispatch, getState) => {
    const key = getClaim(partnerId, periodId).key;
    const state = getState();
    if (showErrors === null || showErrors === undefined) {
      const current = state.editors.claim[key];
      showErrors = current && current.validator.showValidationErrors || false;
    }
    const validator = new ClaimDtoValidator(dto, showErrors);
    dispatch(updateEditorAction(key, claimStore, dto, validator));
    return validator;
  };
}

export function saveClaim(partnerId: string, periodId: number, dto: ClaimDto, onComplete: () => void): AsyncThunk<void, DataLoadAction | UpdateEditorAction> {
  return (dispatch, getState) => {
    const key = getClaim(partnerId, periodId).key;
    const validation = validateClaim(partnerId, periodId, dto, true)(dispatch, getState, null);
    if (!validation.isValid()) {
      return Promise.resolve();
    }
    return ApiClient.claims.update(partnerId, periodId, dto).then((result) => {
      dispatch(dataLoadAction(key, claimStore, LoadingStatus.Done, result));
      onComplete();
    }).catch((e) => {
      console.log("Caught e", e);
      dispatch(updateEditorAction(key, claimStore, dto, validation, e));
    });
  };
}
