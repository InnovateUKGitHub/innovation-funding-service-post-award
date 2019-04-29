import { dataStoreHelper, editorStoreHelper } from "./common";
import { getKey } from "../../../util/key";
import { MonitoringReportDto, ProjectDto } from "../../../types";
import { MonitoringReportDtoValidator } from "../../validators/MonitoringReportDtoValidator";
import { Pending } from "../../../shared/pending";
import { RootState } from "../reducers/rootReducer";
import { getProject } from "./projects";

export const getMonitoringReport = (projectId: string, periodId: number) => dataStoreHelper("monitoringReport", getKey(projectId, periodId));

export const getAllMonitoringReports = (projectId: string) => {
  return dataStoreHelper("monitoringReports", getKey(projectId));
};

export const getMonitoringReportEditor = (projectId: string, periodId: number) => editorStoreHelper<MonitoringReportDto, MonitoringReportDtoValidator>(
  "monitoringReport",
  x => x.monitoringReport,
  (store) => getMonitoringReport(projectId, periodId).getPending(store),
  (monitoringReport, store) => getInitialValdiator(projectId, periodId, monitoringReport, store),
  getKey(projectId, periodId)
);

const getInitialValdiator = (projectId: string, periodId: number, monitoringReport: MonitoringReportDto, store: RootState) => {
  const currentPeriod = getProject(projectId).getPending(store).then(x => x && x.periodId).data || 1;
  const orignalQuestions = getMonitoringReport(projectId, periodId).getPending(store).then(x => x && x.questions).data || [];
  return new MonitoringReportDtoValidator(monitoringReport, false, false, orignalQuestions, currentPeriod);
};
