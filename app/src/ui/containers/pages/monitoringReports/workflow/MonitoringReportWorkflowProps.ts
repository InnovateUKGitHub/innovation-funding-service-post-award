import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { MonitoringReportWorkflowDef } from "./monitoringReportWorkflowDef";

export interface MonitoringReportWorkflowParams {
  projectId: ProjectId;
  id: MonitoringReportId;
  step: number | undefined;
  mode: "view" | "prepare";
}

export interface MonitoringReportWorkflowData {
  project: Pick<ProjectDto, "title" | "id" | "projectNumber">;
  report: MonitoringReportDto;
}

export interface MonitoringReportWorkflowWorkflow {
  workflow: MonitoringReportWorkflowDef;
}
