import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { claimLineItemsStore, findClaimLineItemsByPartnerCostCategoryAndPeriod } from "../selectors/claimLineItems";
import {ClaimLineItemDto} from "../../models";
import {SyncThunk} from "./common";
import {updateEditorAction, UpdateEditorAction} from "./editorActions";
import {ClaimLineItemDtosValidator} from "../../validators/claimLineItemDtosValidator";

export function loadClaimLineItemsForCategory(partnerId: string, costCategoryId: string, periodId: number) {
  return conditionalLoad(
    findClaimLineItemsByPartnerCostCategoryAndPeriod(partnerId, costCategoryId, periodId).key,
    claimLineItemsStore,
    () => ApiClient.claimLineItems.getAllForCategory(partnerId, costCategoryId, periodId)
  );
}

export function validateClaimLineItems(partnerId: string, periodId: number, costCategoryId: string, dto: ClaimLineItemDto[], showErrors?: boolean): SyncThunk<ClaimLineItemDtosValidator, UpdateEditorAction> {
  return (dispatch, getState) => {
    const key = findClaimLineItemsByPartnerCostCategoryAndPeriod(partnerId, costCategoryId, periodId).key;
    const state = getState();
    if (showErrors === null || showErrors === undefined) {
      const current = state.editors.claimLineItems[key];
      showErrors = current && current.validator.showValidationErrors || false;
    }
    const validator = new ClaimLineItemDtosValidator(dto, showErrors);
    dispatch(updateEditorAction(key, claimLineItemsStore, dto, validator));
    return validator;
  };
}

export function saveClaimLineItems(partnerId: string, periodId: number, costCategoryId: string, dto: ClaimLineItemDto[], onComplete: () => void): SyncThunk<void, UpdateEditorAction> {
  return (dispatch, getState) => {
    // const key = findClaimLineItemsByPartnerCostCategoryAndPeriod(partnerId, costCategoryId, periodId).key;
    const validation = validateClaimLineItems(partnerId, periodId, costCategoryId, dto, true)(dispatch, getState, null);
    if (!validation.isValid()) {
      return Promise.resolve();
    }
    // ToDo: Impliment api call
    console.log("Will save", validation);
    onComplete();
    return Promise.resolve();
    /*return ApiClient.claims.update(partnerId, periodId, dto).then((result) => {
      dispatch(dataLoadAction(key, claimLineItemsStore, LoadingStatus.Done, result));
      onComplete();
    }).catch((e) => {
      console.log("Caught e", e);
      dispatch(updateEditorAction(key, claimLineItemsStore, dto, validation, e));
    });*/
  };
}