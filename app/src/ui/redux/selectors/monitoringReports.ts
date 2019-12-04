import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { RootState } from "@ui/redux/reducers/rootReducer";
import { MonitoringReportDto, MonitoringReportQuestionDto } from "@framework/types";
import { MonitoringReportStatus } from "@framework/constants";
import { dataStoreHelper, editorStoreHelper } from "./common";
import { getProject } from "./projects";
import { LoadingStatus, Pending } from "@shared/pending";
import { Result, Results } from "@ui/validation";
import { getKey } from "@ui/redux/stores/storeKeys";

export const getMonitoringReport = (projectId: string, id: string) => dataStoreHelper("monitoringReport", getKey(projectId, id));

export const getAllMonitoringReports = (projectId: string) => {
  return dataStoreHelper("monitoringReports", getKey(projectId));
};

export const getMonitoringReportStatusChanges = (reportId: string) => {
  return dataStoreHelper("monitoringReportStatusChanges", getKey(reportId));
};

export const getMonitoringReportEditor = (projectId: string, id?: string) => editorStoreHelper<MonitoringReportDto, MonitoringReportDtoValidator>(
  "monitoringReport",
  (store) => {
    if (id) {
      return getMonitoringReport(projectId, id).getPending(store);
    }
    return getMonitoringReportQuestions().getPending(store).then(x => getCreateDto(projectId, x));
  },
  (monitoringReport, store) => getInitialValdiator(projectId, monitoringReport, store),
  getKey(projectId, id || "new")
);

const getCreateDto = (projectId: string, questions: MonitoringReportQuestionDto[]): MonitoringReportDto => {
  return {
    status: MonitoringReportStatus.Draft,
    projectId,
    questions,
  } as MonitoringReportDto;
};

const getInitialValdiator = (projectId: string, monitoringReport: MonitoringReportDto, store: RootState) => {
  const currentPeriod = getProject(projectId).getPending(store).then(x => x.periodId);
  const orignalQuestions = getMonitoringReportQuestions().getPending(store);

  return currentPeriod.and(orignalQuestions, (p, q) => new MonitoringReportDtoValidator(monitoringReport, false, false, q, p));
};

export const getMonitoringReportQuestions = () => dataStoreHelper("monitoringReportQuestions", "all");
