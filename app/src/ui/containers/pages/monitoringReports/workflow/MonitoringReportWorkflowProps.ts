import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { MonitoringReportDtoValidator } from "@ui/validation/validators/MonitoringReportDtoValidator";
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
