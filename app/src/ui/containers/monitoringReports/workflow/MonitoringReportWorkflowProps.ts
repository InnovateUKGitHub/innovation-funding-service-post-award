import { MonitoringReportDto, ProjectDto } from "@framework/dtos";
import { ILinkInfo } from "@framework/types";
import { IEditorStore } from "@ui/redux";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { MonitoringReportWorkflowDef } from "./monitoringReportWorkflowDef";

export interface MonitoringReportWorkflowParams {
  projectId: ProjectId;
  id: MonitoringReportId;
  step: number | undefined;
  mode: "view" | "prepare";
}

export interface MonitoringReportWorkflowData {
  project: Pick<ProjectDto, "title" | "id" | "projectNumber">;
  editor: IEditorStore<MonitoringReportDto, MonitoringReportDtoValidator>;
  report: MonitoringReportDto;
}

export interface MonitoringReportWorkflowWorkflow {
  workflow: MonitoringReportWorkflowDef;
}

export interface MonitoringReportWorkflowCallbacks {
  onChange: (save: boolean, dto: MonitoringReportDto, submit?: boolean, link?: ILinkInfo) => void;
}