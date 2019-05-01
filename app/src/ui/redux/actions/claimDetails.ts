import { ApiClient } from "../../apiClient";
import {
  conditionalLoad, DataLoadAction,
  dataLoadAction, EditorAction,
  handleEditorError,
  SyncThunk,
  updateEditorAction,
  UpdateEditorAction
} from "./common";
import { findClaimDetailsByPartner, getClaimDetails, getCostsSummaryForPeriod } from "../selectors";
import { ClaimDetailsValidator } from "@ui/validators";
import { scrollToTheTopSmoothly } from "@util/windowHelpers";
import { LoadingStatus } from "@shared/pending";

export function loadClaimDetailsForPartner(partnerId: string) {
  return conditionalLoad(findClaimDetailsByPartner(partnerId), params => ApiClient.claimDetails.getAllByPartner({partnerId, ...params}));
}

export function loadCostsSummaryForPeriod(projectId: string, partnerId: string, periodId: number) {
  return conditionalLoad(
    getCostsSummaryForPeriod(partnerId, periodId),
    params => ApiClient.costsSummary.getAllByPartnerIdForPeriod({projectId, partnerId, periodId, ...params})
  );
}

export function loadClaimDetails(projectId: string, partnerId: string, periodId: number, costCategoryId: string) {
  return conditionalLoad(getClaimDetails(partnerId, periodId, costCategoryId), params => ApiClient.claimDetails.get({projectId, partnerId, periodId, costCategoryId, ...params}));

}

export function validateClaimDetails(partnerId: string, periodId: number, costCategoryId: string, dto: ClaimDetailsDto, showErrors?: boolean): SyncThunk<ClaimDetailsValidator, UpdateEditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getClaimDetails(partnerId, periodId, costCategoryId);

    if (showErrors === null || showErrors === undefined) {
      const current = state.editors.claimDetail[selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }

    const validator = new ClaimDetailsValidator(dto, showErrors);
    dispatch(updateEditorAction(selector.key, selector.store, dto, validator));

    return validator;
  };
}

export function saveClaimDetails(projectId: string, partnerId: string, periodId: number, costCategoryId: string, claimDetails: ClaimDetailsDto, onComplete: () => void): SyncThunk<void, EditorAction | DataLoadAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getClaimDetails(partnerId, periodId, costCategoryId);
    const validation = validateClaimDetails(partnerId, periodId, costCategoryId, claimDetails, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    return ApiClient.claimDetails.saveClaimDetails({
      projectId,
      partnerId,
      costCategoryId,
      periodId,
      claimDetails,
      user: state.user
    })
      .then((result) => {
        dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Done, result));
        onComplete();
      }).catch((e) => {
        dispatch(handleEditorError({
          id: selector.key,
          store: selector.store,
          dto: claimDetails,
          validation,
          error: e
        }));
      });
  };
}
