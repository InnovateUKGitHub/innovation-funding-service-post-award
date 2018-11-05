import { ApiClient } from "../../apiClient";
import { ClaimLineItemDto } from "../../models";
import { LoadingStatus } from "../../../shared/pending";
import { ClaimLineItemDtosValidator } from "../../validators";
import { findClaimLineItemsByPartnerCostCategoryAndPeriod } from "../selectors";
import { conditionalLoad, dataLoadAction, DataLoadAction, handleError, SyncThunk, updateEditorAction, UpdateEditorAction } from "./common";

export function loadClaimLineItemsForCategory(partnerId: string, costCategoryId: string, periodId: number) {
  return conditionalLoad(
    findClaimLineItemsByPartnerCostCategoryAndPeriod(partnerId, costCategoryId, periodId),
    params => ApiClient.claimLineItems.getAllForCategory({partnerId, costCategoryId, periodId, ...params})
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

export function saveClaimLineItems(partnerId: string, periodId: number, costCategoryId: string, lineItems: ClaimLineItemDto[], onComplete: () => void): SyncThunk<void, UpdateEditorAction | DataLoadAction> {
  return (dispatch, getState) => {
    const state      = getState();
    const selector   = findClaimLineItemsByPartnerCostCategoryAndPeriod(partnerId, costCategoryId, periodId);
    const validation = validateClaimLineItems(partnerId, periodId, costCategoryId, lineItems, true)(dispatch, getState, null);

    if (!validation.isValid) {
      return Promise.resolve();
    }

    return ApiClient.claimLineItems.saveLineItems({partnerId, costCategoryId, periodId, lineItems, user: state.user})
      .then((result) => {
        dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Done, result));
        onComplete();
      }).catch((e) => {
        dispatch(handleError({ id: selector.key, store: selector.store, dto: lineItems, validation, error: e}));
      });
  };
}
