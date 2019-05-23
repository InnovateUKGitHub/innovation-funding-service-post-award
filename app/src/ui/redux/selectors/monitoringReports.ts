import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { RootState } from "@ui/redux/reducers/rootReducer";
import { getKey } from "@framework/util/key";
import { MonitoringReportDto, MonitoringReportQuestionDto } from "@framework/types";
import { MonitoringReportStatus } from "@framework/constants";
import { dataStoreHelper, editorStoreHelper } from "./common";
import { getProject } from "./projects";
import { LoadingStatus, Pending } from "@shared/pending";
import { Result, Results } from "@ui/validation";

export const getMonitoringReport = (projectId: string, id: string) => dataStoreHelper("monitoringReport", getKey(projectId, id));

export const getAllMonitoringReports = (projectId: string) => {
  return dataStoreHelper("monitoringReports", getKey(projectId));
};

export const getMonitoringReportStatusChanges = (reportId: string) => {
  return dataStoreHelper("monitoringReportStatusChanges", getKey(reportId));
};

export const getMonitoringReportEditor = (projectId: string, id?: string ) => editorStoreHelper<MonitoringReportDto, MonitoringReportDtoValidator>(
  "monitoringReport",
  x => x.monitoringReport,
  (store) => {
    if(id) {
      return getMonitoringReport(projectId, id).getPending(store);
    }
    return getMonitoringReportQuestions().getPending(store).then(x => getCreateDto(projectId, x!));
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
  const currentPeriod = getProject(projectId).getPending(store).then(x => x && x.periodId).data || 1;
  const orignalQuestions = getMonitoringReportQuestions().getPending(store).data || [];
  return new MonitoringReportDtoValidator(monitoringReport, false, false, orignalQuestions, currentPeriod);
};

export const getMonitoringReportQuestions = () => dataStoreHelper("monitoringReportQuestions", "all");

export const getMonitoringReportDeleteEditor = (key: string, monitoringReport: MonitoringReportDto) => editorStoreHelper<MonitoringReportDto, Results<MonitoringReportDto>>(
  "monitoringReport",
  x => x.monitoringReport,
  () => (Pending.create({status: LoadingStatus.Done, data: monitoringReport, error: null})),
  () => new Results(monitoringReport, false),
  key
);
