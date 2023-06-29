import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { MonitoringReportDtoValidator } from "@ui/validation/validators/MonitoringReportDtoValidator";

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
