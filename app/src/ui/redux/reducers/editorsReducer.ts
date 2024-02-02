import { combineReducers } from "redux";
import { EditorStatus } from "@ui/redux/constants/enums";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { DocumentUploadDto, MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { ErrorCode } from "@framework/constants/enums";
import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDto } from "@framework/dtos/claimDto";
import { FinancialVirementDto, FinancialLoanVirementDto } from "@framework/dtos/financialVirementDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { LoanDto } from "@framework/dtos/loanDto";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { IAppError } from "@framework/types/IAppError";
import { Results } from "@ui/validation/results";
import { ClaimDetailsValidator } from "@ui/validation/validators/claimDetailsValidator";
import { ClaimDtoValidator } from "@ui/validation/validators/claimDtoValidator";
import {
  DocumentUploadDtoValidator,
  MultipleDocumentUploadDtoValidator,
} from "@ui/validation/validators/documentUploadValidator";
import {
  FinancialVirementDtoValidator,
  FinancialLoanVirementDtoValidator,
} from "@ui/validation/validators/financialVirementDtoValidator";
import { ForecastDetailsDtosValidator } from "@ui/validation/validators/forecastDetailsDtosValidator";
import { MonitoringReportDtoValidator } from "@ui/validation/validators/MonitoringReportDtoValidator";
import { RootActions } from "../actions/root";

export interface IEditorStore<TDto, TValidator> {
  data: TDto;
  validator: TValidator;
  status?: EditorStatus;
  error?: IAppError | null;
}

interface State<TDto, TValidator> {
  [x: string]: IEditorStore<TDto, TValidator>;
}

const getNewStateWithoutErrors = <TDto extends AnyObject, TValidator extends Results<TDto>>(
  state: State<TDto, TValidator>,
): State<TDto, TValidator> => {
  return Object.keys(state).reduce((newState: State<TDto, TValidator>, key) => {
    const editorStore = state[key];
    newState[key] = { ...editorStore, error: null };
    return newState;
  }, {});
};

export const editorsReducer =
  <TDto extends AnyObject, TValidator extends Results<TDto>>(store: string) =>
  (state: State<TDto, TValidator> = {}, action: RootActions) => {
    if (action.type === "EDITOR_UPDATE" && action.payload?.store === store) {
      const result = { ...state };
      const originalEditor = result[action.payload.id];
      const newEditor: IEditorStore<TDto, TValidator> = {
        ...originalEditor,
        data: action.payload.dto as TDto,
        validator: action.payload.validator as TValidator,
        status: EditorStatus.Editing,
      };
      result[action.payload.id] = newEditor;

      return result;
    }

    if (action.type === "EDITOR_SUBMIT" && action.payload?.store === store) {
      const result = { ...state };
      const originalEditor = result[action.payload.id];
      const newEditor: IEditorStore<TDto, TValidator> = {
        ...originalEditor,
        data: action.payload.dto as TDto,
        validator: action.payload.validator as TValidator,
        status: EditorStatus.Saving,
      };
      result[action.payload.id] = newEditor;

      return result;
    }

    if (action.type === "EDITOR_SUBMIT_SUCCESS") {
      const result = getNewStateWithoutErrors(state);
      if (action.payload?.store === store) {
        const originalEditor = result[action.payload.id];
        const newEditor: IEditorStore<TDto, TValidator> = {
          ...originalEditor,
          status: EditorStatus.Editing,
          validator: { ...originalEditor?.validator, showValidationErrors: false },
        };
        result[action.payload.id] = newEditor;
      }
      return result;
    }

    if (action.type === "EDITOR_SUBMIT_ERROR") {
      const result = getNewStateWithoutErrors(state);
      const err = action.payload?.error;
      if (action.payload?.store === store) {
        const originalEditor = result[action.payload?.id];
        const newEditor: IEditorStore<TDto, TValidator> = {
          ...originalEditor,
          data: action.payload?.dto as TDto,
          status: EditorStatus.Editing,
          error: {
            code: err?.code || ErrorCode.UNKNOWN_ERROR,
            message: err?.message || "",
            results: err?.results,
            details: err?.details ?? [],
          },
        };
        result[action.payload?.id] = newEditor;
      }
      return result;
    }

    if (action.type === "EDITOR_RESET" && action.payload?.store === store) {
      // Clear all errors from the Redux state
      const result = getNewStateWithoutErrors(state);

      // Create a copy of the editor, but replace the data with
      // the new replacement default dto
      const newEditor: IEditorStore<TDto, TValidator> = {
        ...result[action.payload?.id],
        data: action.payload?.dto as TDto,
        validator: action.payload.validator as TValidator,
        status: EditorStatus.Editing,
      };

      // Assign the new editor to the state
      result[action.payload?.id] = newEditor;

      // Return the new Redux state
      return result;
    }

    if (action.type === "ROUTE_TRANSITION" && action.payload !== "REPLACE") {
      return {};
    }

    return state;
  };

const reducers = {
  claim: editorsReducer<ClaimDto, ClaimDtoValidator>("claim"),
  claimDetail: editorsReducer<ClaimDetailsDto, ClaimDetailsValidator>("claimDetail"),
  forecastDetails: editorsReducer<ForecastDetailsDTO[], ForecastDetailsDtosValidator>("forecastDetails"),
  initialForecastDetails: editorsReducer<ForecastDetailsDTO[], Results<ForecastDetailsDTO[]>>("initialForecastDetails"),
  financialVirement: editorsReducer<FinancialVirementDto, FinancialVirementDtoValidator>("financialVirement"),
  financialLoanVirement: editorsReducer<FinancialLoanVirementDto, FinancialLoanVirementDtoValidator>(
    "financialLoanVirement",
  ),
  documents: editorsReducer<DocumentUploadDto, DocumentUploadDtoValidator>("documents"),
  multipleDocuments: editorsReducer<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>("multipleDocuments"),
  documentSummary: editorsReducer<DocumentSummaryDto[], Results<DocumentSummaryDto[]>>("documentSummary"),
  monitoringReport: editorsReducer<MonitoringReportDto, MonitoringReportDtoValidator>("monitoringReport"),
  pcr: editorsReducer<PCRDto, Results<PCRDto>>("pcr"),
  partner: editorsReducer<PartnerDto, Results<PartnerDto>>("partner"),
  loan: editorsReducer<LoanDto, Results<LoanDto>>("loan"),
};

export type EditorStateKeys = keyof typeof reducers;

export const editorReducer = combineReducers(reducers);
