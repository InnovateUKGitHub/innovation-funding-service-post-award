import * as Actions from "@ui/redux/actions/common";
import { ApiClient } from "@ui/apiClient";
import { findClaimDetailsByPartner, getClaimDetails, getCostsSummaryForPeriod } from "@ui/redux/selectors";
import { ClaimDetailsValidator } from "@ui/validators";
import { scrollToTheTopSmoothly } from "@util/windowHelpers";
import { LoadingStatus } from "@shared/pending";

export function loadClaimDetailsForPartner(partnerId: string) {
  return Actions.conditionalLoad(
    findClaimDetailsByPartner(partnerId),
    params => ApiClient.claimDetails.getAllByPartner({partnerId, ...params})
  );
}

export function loadCostsSummaryForPeriod(projectId: string, partnerId: string, periodId: number) {
  return Actions.conditionalLoad(
    getCostsSummaryForPeriod(partnerId, periodId),
    params => ApiClient.costsSummary.getAllByPartnerIdForPeriod({projectId, partnerId, periodId, ...params})
  );
}

export function loadClaimDetails(projectId: string, partnerId: string, periodId: number, costCategoryId: string) {
  return Actions.conditionalLoad(
    getClaimDetails(partnerId, periodId, costCategoryId),
    params => ApiClient.claimDetails.get({projectId, partnerId, periodId, costCategoryId, ...params})
  );
}

export function validateClaimDetails(
  partnerId: string,
  periodId: number,
  costCategoryId: string,
  dto: ClaimDetailsDto,
  showErrors?: boolean
): Actions.SyncThunk<ClaimDetailsValidator, Actions.UpdateEditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getClaimDetails(partnerId, periodId, costCategoryId);

    if (showErrors === null || showErrors === undefined) {
      const current = state.editors.claimDetail[selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }

    const validator = new ClaimDetailsValidator(dto, showErrors);
    dispatch(Actions.updateEditorAction(selector.key, selector.store, dto, validator));

    return validator;
  };
}

export function saveClaimDetails(
  projectId: string,
  partnerId: string,
  periodId: number,
  costCategoryId: string,
  claimDetails: ClaimDetailsDto,
  onComplete: () => void
): Actions.SyncThunk<void, Actions.EditorAction | Actions.DataLoadAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getClaimDetails(partnerId, periodId, costCategoryId);
    const validation = validateClaimDetails(partnerId, periodId, costCategoryId, claimDetails, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    dispatch(Actions.handleEditorSubmit(selector.key, selector.store));

    return ApiClient.claimDetails.saveClaimDetails({ projectId, partnerId, costCategoryId, periodId, claimDetails, user: state.user })
      .then((result) => {
        dispatch(Actions.dataLoadAction(selector.key, selector.store, LoadingStatus.Done, result));
        dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
        onComplete();
      })
      .catch((e) => {
        dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto: claimDetails, validation, error: e }));
      });
  };
}
