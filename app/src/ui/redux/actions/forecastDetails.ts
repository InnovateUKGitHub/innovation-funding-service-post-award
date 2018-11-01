import {conditionalLoad, DataLoadAction, dataLoadAction} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import {findForecastDetailsByPartner, getForecastDetail, getForecastDetailsEditor} from "../selectors";
import { ClaimDetailsDto, CostCategoryDto, ForecastDetailsDTO, GOLCostDto } from "../../models";
import { AsyncThunk, SyncThunk } from "./common";
import { ForecastDetailsDtosValidator } from "../../validators/forecastDetailsDtosValidator";
import { handleError, UpdateEditorAction, updateEditorAction } from "./editorActions";
import { LoadingStatus } from "../../../shared/pending";

export function loadForecastDetailsForPartner(partnerId: string, periodId: number) {
  return conditionalLoad(
    findForecastDetailsByPartner(partnerId, periodId).key,
    "forecastDetails",
    (params) => ApiClient.forecastDetails.getAllByPartnerId({partnerId, periodId, ...params})
  );
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
      const selector = getForecastDetailsEditor(partnerId, periodId);
      const state = getState();

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
): AsyncThunk<void, DataLoadAction | UpdateEditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getForecastDetailsEditor(partnerId, periodId);
    const validatorThunk = validateForecastDetails(partnerId, periodId, forecasts, claimDetails, golCosts, costCategories, true);
    const validation = validatorThunk(dispatch, getState, null);

    if (!validation.isValid) {
      return Promise.resolve();
    }

    // send a loading action with undefined as it will just update the status
    dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Loading, undefined));

    return ApiClient.forecastDetails.update({partnerId, periodId, forecasts, submit: updateClaim, user: state.user}).then((result) => {
      dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Done, result));
      onComplete();
    }).catch((e) => {
      dispatch(handleError({id: selector.key, store: selector.store, dto: forecasts, validation, error: e}));
    });
  };
}

export function loadForecastDetail(partnerId: string, periodId: number, costCategoryId: string) {
  return conditionalLoad(
    getForecastDetail(partnerId, periodId, costCategoryId).key,
    "forecastDetail",
    (params) => ApiClient.forecastDetails.get({partnerId, periodId, costCategoryId, ...params})
  );
}
