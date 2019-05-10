import { AsyncThunk, conditionalLoad, DataLoadAction, dataLoadAction, EditorAction, handleEditorError, messageSuccess, SyncThunk, UpdateEditorAction, updateEditorAction } from "./common";
import { ApiClient } from "../../apiClient";
import {
  getAllMonitoringReports,
  getMonitoringReport,
  getMonitoringReportEditor,
  getMonitoringReportQuestions,
  getMonitoringReportStatusChanges
} from "../selectors/monitoringReports";
import { MonitoringReportDto, MonitoringReportQuestionDto, ProjectDto } from "../../../types";
import { MonitoringReportDtoValidator } from "../../validators/MonitoringReportDtoValidator";
import { scrollToTheTopSmoothly } from "../../../util/windowHelpers";
import { LoadingStatus } from "../../../shared/pending";

export function loadMonitoringReport(projectId: string, reportId: string) {
  return conditionalLoad(
    getMonitoringReport(projectId, reportId),
    params => ApiClient.monitoringReports.get({ projectId, reportId, ...params })
  );
}

export function loadMonitoringReportStatusChanges(projectId: string, reportId: string) {
  return conditionalLoad(
    getMonitoringReportStatusChanges(reportId),
    params => ApiClient.monitoringReports.getStatusChanges({ projectId, reportId, ...params })
  );
}

export function loadMonitoringReports(projectId: string) {
  return conditionalLoad(
    getAllMonitoringReports(projectId),
    params => ApiClient.monitoringReports.getAllForProject({ projectId, ...params })
  );
}

export function validateMonitoringReport(projectId: string, id: string, dto: MonitoringReportDto, questions: MonitoringReportQuestionDto[], project: ProjectDto, submit?: boolean, showErrors?: boolean): SyncThunk<MonitoringReportDtoValidator, UpdateEditorAction> {
  return (dispatch, getState) => {
    const selector = getMonitoringReportEditor(projectId, id);
    const state = getState();

    const current = state.editors[selector.store][selector.key];
    if (showErrors === null || showErrors === undefined) {
      showErrors = current && current.validator.showValidationErrors || false;
    }
    if (submit === null || submit === undefined) {
      submit = current && (current.validator as MonitoringReportDtoValidator).submit || false;
    }

    const validator = new MonitoringReportDtoValidator(dto, showErrors, submit, questions, project.periodId);

    dispatch(updateEditorAction(selector.key, selector.store, dto, validator));
    return validator;
  };
}

export function saveMonitoringReport(
  projectId: string,
  id: string,
  dto: MonitoringReportDto,
  questions: MonitoringReportQuestionDto[],
  project: ProjectDto,
  submit: boolean,
  onComplete: () => void,
  message?: string
)
  : AsyncThunk<void, DataLoadAction | EditorAction | messageSuccess> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = getMonitoringReportEditor(projectId, id);
    const validation = validateMonitoringReport(projectId, id, dto, questions, project, submit, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    // send a loading action with undefined as it will just update the status
    dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Loading, undefined));

    const save = !id ? ApiClient.monitoringReports.createMonitoringReport({monitoringReportDto: dto, submit, user: state.user }) : ApiClient.monitoringReports.saveMonitoringReport({ monitoringReportDto: dto, submit, user: state.user });

    return save.then((result) => {
      dispatch(dataLoadAction(selector.key, selector.store, LoadingStatus.Done, result));
      if (message) dispatch(messageSuccess(message));
      onComplete();
    }).catch((e) => {
      dispatch(handleEditorError({ id: selector.key, store: selector.store, dto, validation, error: e }));
    });
  };
}

export function loadMonitoringReportQuestions() {
  return conditionalLoad(
    getMonitoringReportQuestions(),
    params => ApiClient.monitoringReports.getActiveQuestions({ ...params })
  );
}
