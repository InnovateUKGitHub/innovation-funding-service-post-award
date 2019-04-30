import { dataStoreHelper, editorStoreHelper } from "./common";
import { getKey } from "../../../util/key";
import { MonitoringReportDto, MonitoringReportOptionDto, MonitoringReportQuestionDto, ProjectDto } from "../../../types";
import { MonitoringReportDtoValidator } from "../../validators/MonitoringReportDtoValidator";
import { Pending } from "../../../shared/pending";
import { RootState } from "../reducers/rootReducer";
import { getProject } from "./projects";
import { MonitoringReportStatus } from "@framework/types/constants/monitoringReportStatus";

export const getMonitoringReport = (projectId: string, periodId: number) => dataStoreHelper("monitoringReport", getKey(projectId, periodId));

export const getAllMonitoringReports = (projectId: string) => {
  return dataStoreHelper("monitoringReports", getKey(projectId));
};

export const getMonitoringReportEditor = (projectId: string, periodId: number) => editorStoreHelper<MonitoringReportDto, MonitoringReportDtoValidator>(
  "monitoringReport",
  x => x.monitoringReport,
  (store) => periodId === 0 ? getMonitoringReportQuestions().getPending(store).then(x => getCreateDto(projectId, x!)) : getMonitoringReport(projectId, periodId).getPending(store),
  (monitoringReport, store) => getInitialValdiator(projectId, monitoringReport, store),
  periodId === 0 ? getKey(projectId, "new") : getKey(projectId, periodId)
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
