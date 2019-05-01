import { ApiClient } from "../../apiClient";
import { AsyncThunk, conditionalLoad, DataLoadAction, dataLoadAction, EditorAction, messageSuccess, SyncThunk } from "./common";
import { ForecastDetailsDtosValidator } from "../../validators/forecastDetailsDtosValidator";
import { handleEditorError, UpdateEditorAction, updateEditorAction } from "./common/editorActions";
import { LoadingStatus } from "../../../shared/pending";
import {
  findForecastDetailsByPartner,
  findGolCostsByPartner,
  getForecastDetail,
  getForecastDetailsEditor
} from "../selectors";
import { scrollToTheTopSmoothly } from "../../../util/windowHelpers";
import { ClaimDto } from "../../../types";

export function loadForecastDetailsForPartner(partnerId: string) {
  return conditionalLoad(findForecastDetailsByPartner(partnerId), params => ApiClient.forecastDetails.getAllByPartnerId({partnerId, ...params}));
}

export function validateForecastDetails(
  partnerId: string,
  dto: ForecastDetailsDTO[],
  claims: ClaimDto[],
  claimDetails: ClaimDetailsSummaryDto[],
  golCosts: GOLCostDto[],
  showErrors: boolean = false
): SyncThunk <ForecastDetailsDtosValidator, UpdateEditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getForecastDetailsEditor(partnerId);

    if (showErrors === false) {
      const current = state.editors[selector.store][selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }

    const validator = new ForecastDetailsDtosValidator(dto, claims, claimDetails, golCosts, showErrors);
    dispatch(updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function saveForecastDetails(
  updateClaim: boolean,
  projectId: string,
  partnerId: string,
  forecasts: ForecastDetailsDTO[],
  claims: ClaimDto[],
  claimDetails: ClaimDetailsSummaryDto[],
  golCosts: GOLCostDto[],
  onComplete: () => void,
  message: string
): AsyncThunk<void, DataLoadAction | EditorAction | messageSuccess> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getForecastDetailsEditor(partnerId);
    const validatorThunk = validateForecastDetails(partnerId, forecasts, claims, claimDetails, golCosts, true);
    const validation = validatorThunk(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    // send a loading action with undefined as it will just update the status
    dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Loading, undefined));

    return ApiClient.forecastDetails.update({projectId, partnerId, forecasts, submit: updateClaim, user: state.user}).then(result => {
      dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Done, result));
      dispatch(messageSuccess(message));
      onComplete();
    }).catch((e) => {
      dispatch(handleEditorError({id: selector.key, store: selector.store, dto: forecasts, validation, error: e}));
    });
  };
}

export function loadForecastDetail(partnerId: string, periodId: number, costCategoryId: string) {
  return conditionalLoad(getForecastDetail(partnerId, periodId, costCategoryId), params => ApiClient.forecastDetails.get({partnerId, periodId, costCategoryId, ...params}));
}

export function loadForecastGOLCostsForPartner(partnerId: string) {
  return conditionalLoad(findGolCostsByPartner(partnerId), params => ApiClient.forecastGolCosts.getAllByPartnerId({partnerId, ...params}));
}
