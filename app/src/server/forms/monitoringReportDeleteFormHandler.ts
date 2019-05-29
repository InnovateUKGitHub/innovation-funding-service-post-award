import { FormHandlerBase, IFormBody, IFormButton } from "@server/forms/formHandlerBase";
import { MonitoringReportDeleteParams, MonitoringReportDeleteRoute } from "@ui/containers/monitoringReports/delete";
import { MonitoringReportDto } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { DeleteMonitoringReportCommand, GetMonitoringReportById} from "@server/features/monitoringReports";
import { getMonitoringReportEditor } from "@ui/redux/selectors";
import { MonitoringReportDashboardRoute } from "@ui/containers";

export class MonitoringReportDeleteFormHandler extends FormHandlerBase<MonitoringReportDeleteParams, MonitoringReportDto> {

  constructor() {
    super(MonitoringReportDeleteRoute, ["delete"]);
  }

  protected getDto(context: IContext, params: MonitoringReportDeleteParams, button: IFormButton, body: IFormBody): Promise<MonitoringReportDto> {
    return context.runQuery(new GetMonitoringReportById(params.projectId, params.id));
  }

  protected async run(context: IContext, params: MonitoringReportDeleteParams, button: IFormButton, dto: MonitoringReportDto): Promise<ILinkInfo> {
    await context.runCommand(new DeleteMonitoringReportCommand(dto.projectId, dto.headerId));
    return MonitoringReportDashboardRoute.getLink({  projectId: params.projectId });
  }

  protected getStoreInfo(params: MonitoringReportDeleteParams, dto: MonitoringReportDto): { key: string; store: string; } {
    return getMonitoringReportEditor(params.projectId, params.id);
  }

  protected createValidationResult(params: MonitoringReportDeleteParams, dto: MonitoringReportDto): MonitoringReportDtoValidator {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }

}
