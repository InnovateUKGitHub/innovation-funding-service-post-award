import { ApiClient } from "../../apiClient";
import { ClaimDtoValidator } from "../../validators";
import { LoadingStatus } from "../../../shared/pending";
import {
  AsyncThunk,
  conditionalLoad,
  dataLoadAction,
  DataLoadAction,
  EditorAction,
  handleEditorError,
  messageSuccess,
  SyncThunk,
  updateEditorAction,
  UpdateEditorAction
} from "./common";
import {
  findClaimsByPartner,
  findClaimsByProject,
  getClaim,
  getClaimEditor,
  getClaimStatusChanges,
  getCurrentClaim
} from "../selectors";
import { ClaimDto, ClaimStatus } from "../../../types";
import { loadIarDocuments } from ".";
import { scrollToTheTopSmoothly } from "../../../util/windowHelpers";

export function loadClaim(partnerId: string, periodId: number) {
  return conditionalLoad(getClaim(partnerId, periodId), params => ApiClient.claims.get({partnerId, periodId, ...params}));
}

// update editor with validation
export function validateClaim(partnerId: string, periodId: number, dto: ClaimDto, details: CostsSummaryForPeriodDto[], costCategories: CostCategoryDto[], showErrors?: boolean): SyncThunk<ClaimDtoValidator, UpdateEditorAction> {
  return (dispatch, getState) => {
    const selector = getClaimEditor(partnerId, periodId);
    const state = getState();
    if (showErrors === null || showErrors === undefined) {
      const current = state.editors[selector.store][selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }
    const originalStatus = getClaim(partnerId, periodId).getPending(state).then(x => x && x.status).data || ClaimStatus.UNKNOWN;
    const validator = new ClaimDtoValidator(dto, originalStatus, details, costCategories, showErrors);

    dispatch(updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function saveClaim(
  projectId: string,
  partnerId: string,
  periodId: number,
  claim: ClaimDto,
  details: CostsSummaryForPeriodDto[],
  costCategories: CostCategoryDto[],
  onComplete: () => void,
  message?: string
)
  : AsyncThunk<void, DataLoadAction | EditorAction | messageSuccess> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getClaimEditor(partnerId, periodId);
    const validation = validateClaim(partnerId, periodId, claim, details, costCategories, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    // send a loading action with undefined as it will just update the status
    dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Loading, undefined));

    return ApiClient.claims.update({ projectId, partnerId, periodId, claim, user: state.user }).then((result) => {
      dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Done, result));
      if (message) dispatch(messageSuccess(message));
      onComplete();
    }).catch((e) => {
      dispatch(handleEditorError({ id: selector.key, store: selector.store, dto: claim, validation, error: e }));
    });
  };
}

export function loadClaimsForPartner(partnerId: string) {
  return conditionalLoad(findClaimsByPartner(partnerId), params => ApiClient.claims.getAllByPartnerId({ partnerId, ...params }));
}

export function loadClaimStatusChanges(projectId: string, partnerId: string, periodId: number,) {
  return conditionalLoad(getClaimStatusChanges(projectId, partnerId, periodId), params => ApiClient.claims.getStatusChanges({ projectId, partnerId, periodId, ...params}));
}

export function loadIarDocumentsForCurrentClaim(partnerId: string): AsyncThunk<void, DataLoadAction> {
  return (dispatch, getState) => {
    const claim = getCurrentClaim(getState(), partnerId).data;
    if (claim) {
      return loadIarDocuments(partnerId, claim.periodId)(dispatch, getState, null);
    }
    return Promise.resolve();
  };
}

export function loadClaimsForProject(projectId: string) {
  return conditionalLoad(findClaimsByProject(projectId), params => ApiClient.claims.getAllByProjectId({ projectId, ...params }));
}
