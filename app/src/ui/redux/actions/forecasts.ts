import { ApiClient } from "../../apiClient";
import { AsyncThunk, conditionalLoad, DataLoadAction, dataLoadAction, EditorAction, SyncThunk } from "./common";
import { ForecastDetailsDtosValidator } from "../../validators/forecastDetailsDtosValidator";
import { handleEditorError, UpdateEditorAction, updateEditorAction } from "./common/editorActions";
import { LoadingStatus } from "../../../shared/pending";
import {
  findForecastDetailsByPartner,
  findGolCostsByPartner,
  getForecastDetail,
  getForecastDetailsEditor
} from "../selectors";
import { scrollToTheTop } from "../../../util/windowHelpers";

export function loadForecastDetailsForPartner(partnerId: string) {
  return conditionalLoad(findForecastDetailsByPartner(partnerId), params => ApiClient.forecastDetails.getAllByPartnerId({partnerId, ...params}));
}

export function validateForecastDetails(
  partnerId: string,
  periodId: number,
  dto: ForecastDetailsDTO[],
  claimDetails: ClaimDetailsDto[],
  golCosts: GOLCostDto[],
  costCategories: CostCategoryDto[],
  showErrors: boolean = false
): SyncThunk <ForecastDetailsDtosValidator, UpdateEditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getForecastDetailsEditor(state, partnerId);

    if (showErrors === false) {
      const current = state.editors[selector.store][selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }

    const validator = new ForecastDetailsDtosValidator (periodId, dto, claimDetails, golCosts, costCategories, showErrors);
    dispatch(updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function saveForecastDetails(
  updateClaim: boolean,
  partnerId: string,
  periodId: number,
  forecasts: ForecastDetailsDTO[],
  claimDetails: ClaimDetailsDto[],
  golCosts: GOLCostDto[],
  costCategories: CostCategoryDto[],
  onComplete: () => void
): AsyncThunk<void, DataLoadAction | EditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getForecastDetailsEditor(state, partnerId);
    const validatorThunk = validateForecastDetails(partnerId, periodId, forecasts, claimDetails, golCosts, costCategories, true);
    const validation = validatorThunk(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTop();
      return Promise.resolve();
    }

    // send a loading action with undefined as it will just update the status
    dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Loading, undefined));

    return ApiClient.forecastDetails.update({partnerId, periodId, forecasts, submit: updateClaim, user: state.user}).then((result) => {
      dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Done, result));
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
