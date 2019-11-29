import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { MonitoringReportDto } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { DeleteMonitoringReportCommand, GetMonitoringReportById} from "@server/features/monitoringReports";
import { getMonitoringReportEditor } from "@ui/redux/selectors";
import { MonitoringReportDashboardRoute, MonitoringReportDeleteParams, MonitoringReportDeleteRoute } from "@ui/containers";

export class MonitoringReportDeleteFormHandler extends StandardFormHandlerBase<MonitoringReportDeleteParams, "monitoringReport"> {

  constructor() {
    super(MonitoringReportDeleteRoute, ["delete"], "monitoringReport");
  }

  protected getDto(context: IContext, params: MonitoringReportDeleteParams, button: IFormButton, body: IFormBody): Promise<MonitoringReportDto> {
    return context.runQuery(new GetMonitoringReportById(params.projectId, params.id));
  }

  protected async run(context: IContext, params: MonitoringReportDeleteParams, button: IFormButton, dto: MonitoringReportDto): Promise<ILinkInfo> {
    await context.runCommand(new DeleteMonitoringReportCommand(dto.projectId, dto.headerId));
    return MonitoringReportDashboardRoute.getLink({  projectId: params.projectId });
  }

  protected getStoreKey(params: MonitoringReportDeleteParams, dto: MonitoringReportDto) {
    return getMonitoringReportEditor(params.projectId, params.id).key;
  }

  protected createValidationResult(params: MonitoringReportDeleteParams, dto: MonitoringReportDto): MonitoringReportDtoValidator {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }

}
