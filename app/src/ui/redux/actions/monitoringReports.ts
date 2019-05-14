import * as Actions from "@ui/redux/actions/common";
import * as Selectors from "@ui/redux/selectors";
import { ApiClient } from "@ui/apiClient";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { scrollToTheTopSmoothly } from "@util/windowHelpers";
import { LoadingStatus } from "@shared/pending";
import { MonitoringReportDto, MonitoringReportQuestionDto, ProjectDto } from "@framework/types";

export function loadMonitoringReport(projectId: string, reportId: string) {
  return Actions.conditionalLoad(
    Selectors.getMonitoringReport(projectId, reportId),
    params => ApiClient.monitoringReports.get({ projectId, reportId, ...params })
  );
}

export function loadMonitoringReportStatusChanges(projectId: string, reportId: string) {
  return Actions.conditionalLoad(
    Selectors.getMonitoringReportStatusChanges(reportId),
    params => ApiClient.monitoringReports.getStatusChanges({ projectId, reportId, ...params })
  );
}

export function loadMonitoringReports(projectId: string) {
  return Actions.conditionalLoad(
    Selectors.getAllMonitoringReports(projectId),
    params => ApiClient.monitoringReports.getAllForProject({ projectId, ...params })
  );
}

export function validateMonitoringReport(
  projectId: string,
  id: string,
  dto: MonitoringReportDto,
  questions: MonitoringReportQuestionDto[],
  project: ProjectDto,
  submit?: boolean,
  showErrors?: boolean
): Actions.SyncThunk<MonitoringReportDtoValidator, Actions.UpdateEditorAction> {
  return (dispatch, getState) => {
    const selector = Selectors.getMonitoringReportEditor(projectId, id);
    const state = getState();

    const current = state.editors[selector.store][selector.key];
    if (showErrors === null || showErrors === undefined) {
      showErrors = current && current.validator.showValidationErrors || false;
    }
    if (submit === null || submit === undefined) {
      submit = current && (current.validator as MonitoringReportDtoValidator).submit || false;
    }

    const validator = new MonitoringReportDtoValidator(dto, showErrors, submit, questions, project.periodId);

    dispatch(Actions.updateEditorAction(selector.key, selector.store, dto, validator));
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
): Actions.AsyncThunk<void, Actions.DataLoadAction | Actions.EditorAction | Actions.messageSuccess> {
  return (dispatch, getState) => {
    const state = getState();
    const selector = Selectors.getMonitoringReportEditor(projectId, id);
    const validation = validateMonitoringReport(projectId, id, dto, questions, project, submit, true)(dispatch, getState, null);

    if (!validation.isValid) {
      scrollToTheTopSmoothly();
      return Promise.resolve();
    }

    // send a loading action with undefined as it will just update the status
    dispatch(Actions.handleEditorSubmit(selector.key, selector.store));
    dispatch(Actions.dataLoadAction(selector.key, selector.store, LoadingStatus.Loading, undefined));

    const save = !id
      ? ApiClient.monitoringReports.createMonitoringReport({monitoringReportDto: dto, submit, user: state.user })
      : ApiClient.monitoringReports.saveMonitoringReport({ monitoringReportDto: dto, submit, user: state.user });

    return save.then((result) => {
      dispatch(Actions.dataLoadAction(selector.key, selector.store, LoadingStatus.Done, result));
      dispatch(Actions.handleEditorSuccess(selector.key, selector.store));

      if (message) dispatch(Actions.messageSuccess(message));
      onComplete();
    })
    .catch((e) => {
      dispatch(Actions.handleEditorError({ id: selector.key, store: selector.store, dto, validation, error: e }));
    });
  };
}

export function loadMonitoringReportQuestions() {
  return Actions.conditionalLoad(
    Selectors.getMonitoringReportQuestions(),
    params => ApiClient.monitoringReports.getActiveQuestions({ ...params })
  );
}
