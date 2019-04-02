import { AsyncThunk, conditionalLoad, DataLoadAction, dataLoadAction, EditorAction, handleEditorError, messageSuccess, SyncThunk, UpdateEditorAction, updateEditorAction } from "./common";
import { ApiClient } from "../../apiClient";
import { getAllMonitoringReports, getMonitoringReport, getMonitoringReportEditor } from "../selectors/monitoringReports";
import { MonitoringReportDto, QuestionDto } from "../../../types";
import { MonitoringReportDtoValidator } from "../../validators/MonitoringReportDtoValidator";
import { scrollToTheTop } from "../../../util/windowHelpers";
import { LoadingStatus } from "../../../shared/pending";

export function loadMonitoringReport(projectId: string, periodId: number) {
  return conditionalLoad(
    getMonitoringReport(projectId, periodId),
    params => ApiClient.monitoringReports.get({projectId, periodId, ...params})
  );
}

export function loadMonitoringReports(projectId: string) {
  return conditionalLoad(
    getAllMonitoringReports(projectId),
    params => ApiClient.monitoringReports.getAllForProject({projectId, ...params})
  );
}

export function validateMonitoringReport(projectId: string, periodId: number, dto: MonitoringReportDto, questions: QuestionDto[], submit?: boolean, showErrors?: boolean): SyncThunk<MonitoringReportDtoValidator, UpdateEditorAction> {
  return (dispatch, getState) => {
    const selector = getMonitoringReportEditor(projectId, periodId);
    const state = getState();

    const current = state.editors[selector.store][selector.key];
    if (showErrors === null || showErrors === undefined) {
      showErrors = current && current.validator.showValidationErrors || false;
    }
    if(submit === null || submit === undefined) {
      submit = current && (current.validator as MonitoringReportDtoValidator).submit || false;
    }

    const validator = new MonitoringReportDtoValidator(dto, showErrors, submit, questions);

    dispatch(updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function saveMonitoringReport(
  projectId: string,
  periodId: number,
  dto: MonitoringReportDto,
  questions: QuestionDto[],
  submit: boolean,
  onComplete: () => void,
  message?: string
)
  : AsyncThunk<void, DataLoadAction | EditorAction | messageSuccess> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getMonitoringReportEditor(projectId, periodId);
    const validation = validateMonitoringReport(projectId, periodId, dto, questions, submit, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTop();
      return Promise.resolve();
    }

    // send a loading action with undefined as it will just update the status
    dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Loading, undefined));

    return ApiClient.monitoringReports.saveMonitoringReport({ monitoringReportDto: dto, submit, user: state.user }).then((result) => {
      dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Done, result));
      if (message) dispatch(messageSuccess(message));
      onComplete();
    }).catch((e) => {
      dispatch(handleEditorError({ id: selector.key, store: selector.store, dto, validation, error: e }));
    });
  };
}
