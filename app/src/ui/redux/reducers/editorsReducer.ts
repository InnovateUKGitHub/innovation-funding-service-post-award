import { combineReducers } from "redux";
import { RootActions } from "../actions";
import { ClaimDtoValidator } from "../../validators/claimDtoValidator";
import { ClaimLineItemDtosValidator } from "../../validators/claimLineItemDtosValidator";
import { Results } from "../../validation/results";
import { ForecastDetailsDtosValidator } from "../../validators/forecastDetailsDtosValidator";
import { DocumentUploadValidator } from "../../validators/documentUploadValidator";
import { ClaimDto, MonitoringReportDto } from "../../../types";
import { IAppError } from "../../../types/IAppError";
import { MonitoringReportDtoValidator } from "../../validators/MonitoringReportDtoValidator";

export interface IEditorStore<TDto, TValidator> {
  data: TDto;
  validator: TValidator;
  error?: IAppError | null;
}

interface State<TDto, TValidator> {
  [x: string]: IEditorStore<TDto, TValidator>;
}

const getNewStateWithoutErrors = <TDto extends {}, TValidator extends Results<TDto>>(state: State<TDto, TValidator>): State<TDto, TValidator> => {
  return Object.keys(state).reduce((newState: State<TDto, TValidator>, key) => {
    const editorStore = state[key];
    newState[key] = { ...editorStore, error: null };
    return newState;
  }, {});
};

export const editorsReducer = <TDto extends {}, TValidator extends Results<TDto>>(store: string) => (state: State<TDto, TValidator> = {}, action: RootActions) => {
  if (action.type === "UPDATE_EDITOR" && action.payload.store === store) {
    const result = { ...state };
    const originalEditor = result[action.payload.id];
    const newEditor: IEditorStore<TDto, TValidator> = {
      ...originalEditor,
      data: action.payload.dto as TDto,
      validator: action.payload.validator as TValidator
    };
    result[action.payload.id] = newEditor;

    return result;
  }
  if (action.type === "EDITOR_SUBMIT_SUCCESS") {
    const result = getNewStateWithoutErrors(state);
    if (action.payload.store === store) delete result[action.payload.id];
    return result;
  }
  if (action.type === "EDITOR_SUBMIT_ERROR") {
    const result = getNewStateWithoutErrors(state);
    const err = action.payload.error;
    if (action.payload.store === store) {
      const originalEditor = result[action.payload.id];
      const newEditor: IEditorStore<TDto, TValidator> = {
        ...originalEditor,
        data: action.payload.dto as TDto,
        error: { code: err.code, message: err.message, results: err.results }
      };
      result[action.payload.id] = newEditor;
    }
    return result;
  }
  else if (action.type === "@@router5/TRANSITION_START" && action.payload.previousRoute) {
    return {};
  }
  else {
    return state;
  }
};

export const editorReducer = combineReducers({
  claim: editorsReducer<ClaimDto, ClaimDtoValidator>("claim"),
  claimLineItems: editorsReducer<ClaimLineItemDto[], ClaimLineItemDtosValidator>("claimLineItems"),
  forecastDetails: editorsReducer<ForecastDetailsDTO[], ForecastDetailsDtosValidator>("forecastDetails"),
  documents: editorsReducer<DocumentUploadDto, DocumentUploadValidator>("documents"),
  documentSummary: editorsReducer<DocumentSummaryDto[], Results<DocumentSummaryDto[]>>("documentSummary"),
  monitoringReport: editorsReducer<MonitoringReportDto, MonitoringReportDtoValidator>("monitoringReport")
});
