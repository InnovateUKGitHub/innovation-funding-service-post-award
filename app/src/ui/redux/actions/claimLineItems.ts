import {
  conditionalLoad,
  DataLoadAction,
  dataLoadAction,
  EditorAction,
  handleEditorError,
  SyncThunk,
  updateEditorAction,
  UpdateEditorAction
} from "@ui/redux/actions/common";
import { findClaimLineItemsByPartnerCostCategoryAndPeriod, getClaimLineItemEditor } from "@ui/redux/selectors";
import { ApiClient } from "../../apiClient";
import { ClaimLineItemsFormData } from "@framework/types/dtos/claimLineItemsFormData";
import { ClaimLineItemFormValidator } from "@ui/validators";
import { scrollToTheTopSmoothly } from "@util/windowHelpers";
import { LoadingStatus } from "@shared/pending";

export function loadClaimLineItemsForCategory(projectId: string, partnerId: string, costCategoryId: string, periodId: number) {
  return conditionalLoad(
    findClaimLineItemsByPartnerCostCategoryAndPeriod(partnerId, costCategoryId, periodId),
    params => ApiClient.claimLineItems.getAllForCategory({ projectId, partnerId, costCategoryId, periodId, ...params })
  );
}

export function validateClaimLineItems(partnerId: string, periodId: number, costCategoryId: string, dto: ClaimLineItemsFormData, showErrors?: boolean): SyncThunk<ClaimLineItemFormValidator, UpdateEditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getClaimLineItemEditor(partnerId, periodId, costCategoryId);

    if (showErrors === null || showErrors === undefined) {
      const current = state.editors.claimLineItemsForm[selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }

    const validator = new ClaimLineItemFormValidator(dto, showErrors);
    dispatch(updateEditorAction(selector.key, selector.store, dto, validator));

    return validator;
  };
}

export function saveClaimLineItems(projectId: string, partnerId: string, periodId: number, costCategoryId: string, claimLineItemsFormData: ClaimLineItemsFormData, onComplete: () => void): SyncThunk<void, EditorAction | DataLoadAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = findClaimLineItemsByPartnerCostCategoryAndPeriod(partnerId, costCategoryId, periodId);
    const editorSelector = getClaimLineItemEditor(partnerId, periodId, costCategoryId);
    const validation = validateClaimLineItems(partnerId, periodId, costCategoryId, claimLineItemsFormData, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    return ApiClient.claimLineItems.saveLineItems({
      projectId,
      partnerId,
      costCategoryId,
      periodId,
      claimLineItemsFormData,
      user: state.user
    })
      .then((result) => {
        dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Done, result));
        onComplete();
      }).catch((e) => {
        dispatch(handleEditorError({
          id: editorSelector.key,
          store: editorSelector.store,
          dto: claimLineItemsFormData,
          validation,
          error: e
        }));
      });
  };
}
