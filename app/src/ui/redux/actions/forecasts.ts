import * as Actions from "@ui/redux/actions/common";
import * as Selectors from "@ui/redux/selectors";
import { ApiClient } from "@ui/apiClient";
import { ForecastDetailsDtosValidator } from "@ui/validators/forecastDetailsDtosValidator";
import { LoadingStatus } from "@shared/pending";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { ClaimDto } from "@framework/types";

export function loadForecastDetailsForPartner(partnerId: string) {
  return Actions.conditionalLoad(
    Selectors.findForecastDetailsByPartner(partnerId),
    params => ApiClient.forecastDetails.getAllByPartnerId({partnerId, ...params})
  );
}

export function validateForecastDetails(
  partnerId: string,
  dto: ForecastDetailsDTO[],
  claims: ClaimDto[],
  claimDetails: ClaimDetailsSummaryDto[],
  golCosts: GOLCostDto[],
  showErrors: boolean = false
): Actions.SyncThunk<ForecastDetailsDtosValidator, Actions.UpdateEditorAction> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = Selectors.getForecastDetailsEditor(partnerId);

    if (showErrors === false) {
      const current = state.editors[selector.store][selector.key];
      showErrors = current && current.validator.showValidationErrors || false;
    }

    const validator = new ForecastDetailsDtosValidator(dto, claims, claimDetails, golCosts, showErrors);
    dispatch(Actions.updateEditorAction(selector.key, selector.store, dto, validator));
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
): Actions.AsyncThunk<void, Actions.DataLoadAction | Actions.EditorAction | Actions.messageSuccess> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = Selectors.getForecastDetailsEditor(partnerId);
    const validatorThunk = validateForecastDetails(partnerId, forecasts, claims, claimDetails, golCosts, true);
    const validation = validatorThunk(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    // send a loading action with undefined as it will just update the status
    dispatch(Actions.handleEditorSubmit(selector.key, selector.store, forecasts, validation));
    dispatch(Actions.dataLoadAction(selector.key, selector.store, LoadingStatus.Loading, undefined));

    return ApiClient.forecastDetails.update({projectId, partnerId, forecasts, submit: updateClaim, user: state.user}).then(result => {
      dispatch(Actions.dataLoadAction(selector.key, selector.store, LoadingStatus.Done, result));
      dispatch(Actions.handleEditorSuccess(selector.key, selector.store));
      dispatch(Actions.messageSuccess(message));
      onComplete();
    })
    .catch((e) => {
      dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto: forecasts, validation, error: e }));
    });
  };
}

export function loadForecastDetail(partnerId: string, periodId: number, costCategoryId: string) {
  return Actions.conditionalLoad(
    Selectors.getForecastDetail(partnerId, periodId, costCategoryId),
    params => ApiClient.forecastDetails.get({partnerId, periodId, costCategoryId, ...params})
  );
}

export function loadForecastGOLCostsForPartner(partnerId: string) {
  return Actions.conditionalLoad(
    Selectors.findGolCostsByPartner(partnerId),
    params => ApiClient.forecastGolCosts.getAllByPartnerId({partnerId, ...params})
  );
}
