import * as Actions from "@ui/redux/actions/common";
import * as Selectors from "@ui/redux/selectors";
import { ApiClient } from "@ui/apiClient";
import { ClaimDtoValidator } from "@ui/validators";
import { LoadingStatus } from "@shared/pending";
import { ClaimDto, ClaimStatus } from "@framework/types";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { loadIarDocuments } from "./documents";

export function loadClaim(partnerId: string, periodId: number) {
  return Actions.conditionalLoad(
    Selectors.getClaim(partnerId, periodId),
    params => ApiClient.claims.get({partnerId, periodId, ...params})
  );
}

// update editor with validation
export function validateClaim(
  partnerId: string,
  periodId: number,
  dto: ClaimDto,
  details: CostsSummaryForPeriodDto[],
  costCategories: CostCategoryDto[],
  showErrors?: boolean
): Actions.SyncThunk<ClaimDtoValidator, Actions.UpdateEditorAction> {
  return (dispatch, getState) => {
    const selector = Selectors.getClaimEditor(partnerId, periodId);
    const state = getState();

    if (showErrors === null || showErrors === undefined) {
      const current = state.editors[selector.store][selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }
    const originalStatus = Selectors.getClaim(partnerId, periodId).getPending(state).then(x => x && x.status).data || ClaimStatus.UNKNOWN;
    const validator = new ClaimDtoValidator(dto, originalStatus, details, costCategories, showErrors);

    dispatch(Actions.updateEditorAction(selector.key, selector.store, dto, validator));
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
): Actions.AsyncThunk<void, Actions.DataLoadAction | Actions.EditorAction | Actions.messageSuccess> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = Selectors.getClaimEditor(partnerId, periodId);
    const validation = validateClaim(partnerId, periodId, claim, details, costCategories, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    dispatch(Actions.handleEditorSubmit(selector.key, selector.store, claim, validation));

    return ApiClient.claims.update({ projectId, partnerId, periodId, claim, user: state.user }).then((result) => {
      dispatch(Actions.dataLoadAction(selector.key, selector.store, LoadingStatus.Updated, result));
      dispatch(Actions.handleEditorSuccess(selector.key, selector.store));

      if (message) dispatch(Actions.messageSuccess(message));
      onComplete();
    })
    .catch((e) => {
      dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto: claim, validation, error: e }));
    });
  };
}

export function loadClaimsForPartner(partnerId: string) {
  return Actions.conditionalLoad(
    Selectors.findClaimsByPartner(partnerId),
    params => ApiClient.claims.getAllByPartnerId({ partnerId, ...params })
  );
}

export function loadClaimStatusChanges(projectId: string, partnerId: string, periodId: number,) {
  return Actions.conditionalLoad(
    Selectors.getClaimStatusChanges(projectId, partnerId, periodId),
    params => ApiClient.claims.getStatusChanges({ projectId, partnerId, periodId, ...params})
  );
}

export function loadIarDocumentsForCurrentClaim(projectId: string, partnerId: string): Actions.AsyncThunk<void, Actions.DataLoadAction> {
  return (dispatch, getState) => {
    const claim = Selectors.getCurrentClaim(getState(), partnerId).data;
    if (claim) {
      return loadIarDocuments(projectId, partnerId, claim.periodId)(dispatch, getState, null);
    }
    return Promise.resolve();
  };
}

export function loadIarDocumentsForLeadPartnerCurrentClaim(projectId: string): Actions.AsyncThunk<void, Actions.DataLoadAction> {
  return (dispatch, getState) => {
    const claim = Selectors.getLeadPartnerCurrentClaim(getState(), projectId).data;
    if (claim) {
      return loadIarDocuments(projectId, claim.partnerId, claim.periodId)(dispatch, getState, null);
    }
    return Promise.resolve();
  };
}

export function loadClaimsForProject(projectId: string) {
  return Actions.conditionalLoad(
    Selectors.findClaimsByProject(projectId),
    params => ApiClient.claims.getAllByProjectId({ projectId, ...params })
  );
}
