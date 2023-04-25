import { MonitoringReportDto, ProjectDto } from "@framework/dtos";
import { ILinkInfo } from "@framework/types";
import { IEditorStore } from "@ui/redux";
import { MonitoringReportDtoValidator } from "@ui/validators";

export interface MonitoringReportCreateParams {
  projectId: ProjectId;
}

export interface MonitoringReportCreateData {
  project: ProjectDto;
  editor: IEditorStore<MonitoringReportDto, MonitoringReportDtoValidator>;
}

export interface MonitoringReportCreateCallbacks {
  onChange: (
    save: boolean,
    dto: MonitoringReportDto,
    submit?: boolean,
    getLink?: (id: MonitoringReportId) => ILinkInfo,
  ) => void;
}
