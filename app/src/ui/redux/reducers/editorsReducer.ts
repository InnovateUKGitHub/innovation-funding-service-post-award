import { combineReducers } from "redux";
import { actionTypes } from "redux-router5";
import * as Validators from "@ui/validators";
import { RootActions } from "@ui/redux/actions";
import { Results } from "@ui/validation/results";
import { ClaimDto, IAppError, MonitoringReportDto, PartnerDto } from "@framework/types";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { DocumentUploadDto, MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

export enum EditorStatus {
  Editing = 1,
  Saving = 2
}

export interface IEditorStore<TDto, TValidator> {
  data: TDto;
  validator: TValidator;
  status?: EditorStatus;
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
  if (action.type === "EDITOR_UPDATE" && action.payload.store === store) {
    const result = { ...state };
    const originalEditor = result[action.payload.id];
    const newEditor: IEditorStore<TDto, TValidator> = {
      ...originalEditor,
      data: action.payload.dto as TDto,
      validator: action.payload.validator as TValidator,
      status: EditorStatus.Editing
    };
    result[action.payload.id] = newEditor;

    return result;
  }

  if (action.type === "EDITOR_SUBMIT" && action.payload.store === store) {
    const result = { ...state };
    const originalEditor = result[action.payload.id];
    const newEditor: IEditorStore<TDto, TValidator> = {
      ...originalEditor,
      data: action.payload.dto as TDto,
      validator: action.payload.validator as TValidator,
      status: EditorStatus.Saving
    };
    result[action.payload.id] = newEditor;

    return result;
  }

  if (action.type === "EDITOR_SUBMIT_SUCCESS") {
    const result = getNewStateWithoutErrors(state);
    if (action.payload.store === store) {
      const originalEditor = result[action.payload.id];
      const newEditor: IEditorStore<TDto, TValidator> = {
        ...originalEditor,
        status: EditorStatus.Editing
      };
      result[action.payload.id] = newEditor;
    }
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
        status: EditorStatus.Editing,
        error: { code: err.code, message: err.message, results: err.results }
      };
      result[action.payload.id] = newEditor;
    }
    return result;
  }

  if (action.type === "EDITOR_RESET" && action.payload.store === store) {
    const result = getNewStateWithoutErrors(state);
    delete result[action.payload.id];
    return result;
  }

  if (action.type === actionTypes.TRANSITION_SUCCESS) {
    const hasPreviousRoute = action.payload.previousRoute !== null;
    const isReplacing = (action.payload.route && action.payload.route.meta && action.payload.route.meta && action.payload.route.meta.options && action.payload.route.meta.options.replace === true) || false;
    if (hasPreviousRoute && !isReplacing) {
      return {};
    }
  }

  return state;
};

export const editorReducer = combineReducers({
  claim: editorsReducer<ClaimDto, Validators.ClaimDtoValidator>("claim"),
  claimDetail: editorsReducer<ClaimDetailsDto, Validators.ClaimDetailsValidator>("claimDetail"),
  forecastDetails: editorsReducer<ForecastDetailsDTO[], Validators.ForecastDetailsDtosValidator>("forecastDetails"),
  initialForecastDetails: editorsReducer<ForecastDetailsDTO[], Results<ForecastDetailsDTO[]>>("initialForecastDetails"),
  financialVirement: editorsReducer<FinancialVirementDto, Validators.FinancialVirementDtoValidator>("financialVirement"),
  documents: editorsReducer<DocumentUploadDto, Validators.DocumentUploadDtoValidator>("documents"),
  multipleDocuments: editorsReducer<MultipleDocumentUploadDto, Validators.MultipleDocumentUpdloadDtoValidator>("multipleDocuments"),
  documentSummary: editorsReducer<DocumentSummaryDto[], Results<DocumentSummaryDto[]>>("documentSummary"),
  monitoringReport: editorsReducer<MonitoringReportDto, Validators.MonitoringReportDtoValidator>("monitoringReport"),
  pcr: editorsReducer<PCRDto, Results<PCRDto>>("pcr"),
  partner: editorsReducer<PartnerDto, Results<PartnerDto>>("partner"),
});
