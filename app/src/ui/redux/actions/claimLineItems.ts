import { ApiClient } from "../../apiClient";
import { LoadingStatus } from "../../../shared/pending";
import { ClaimLineItemDtosValidator } from "../../validators";
import { findClaimLineItemsByPartnerCostCategoryAndPeriod } from "../selectors";
import {
  conditionalLoad,
  dataLoadAction,
  DataLoadAction,
  EditorAction,
  handleEditorError,
  SyncThunk,
  updateEditorAction,
  UpdateEditorAction
} from "./common";
import { scrollToTheTopSmoothly } from "../../../util/windowHelpers";

export function loadClaimLineItemsForCategory(projectId: string, partnerId: string, costCategoryId: string, periodId: number) {
  return conditionalLoad(
    findClaimLineItemsByPartnerCostCategoryAndPeriod(partnerId, costCategoryId, periodId),
    params => ApiClient.claimLineItems.getAllForCategory({projectId, partnerId, costCategoryId, periodId, ...params})
  );
}

export function validateClaimLineItems(partnerId: string, periodId: number, costCategoryId: string, dto: ClaimLineItemDto[], showErrors?: boolean): SyncThunk<ClaimLineItemDtosValidator, UpdateEditorAction> {
  return (dispatch, getState) => {
    const state    = getState();
    const selector = findClaimLineItemsByPartnerCostCategoryAndPeriod(partnerId, costCategoryId, periodId);

    if (showErrors === null || showErrors === undefined) {
      const current = state.editors.claimLineItems[selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }

    const validator = new ClaimLineItemDtosValidator(dto, showErrors);
    dispatch(updateEditorAction(selector.key, selector.store, dto, validator));

    return validator;
  };
}

export function saveClaimLineItems(projectId: string, partnerId: string, periodId: number, costCategoryId: string, lineItems: ClaimLineItemDto[], onComplete: () => void): SyncThunk<void, EditorAction | DataLoadAction> {
  return (dispatch, getState) => {
    const state      = getState();
    const selector   = findClaimLineItemsByPartnerCostCategoryAndPeriod(partnerId, costCategoryId, periodId);
    const validation = validateClaimLineItems(partnerId, periodId, costCategoryId, lineItems, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    return ApiClient.claimLineItems.saveLineItems({projectId, partnerId, costCategoryId, periodId, lineItems, user: state.user})
      .then((result) => {
        dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Done, result));
        onComplete();
      }).catch((e) => {
        dispatch(handleEditorError({ id: selector.key, store: selector.store, dto: lineItems, validation, error: e}));
      });
  };
}
