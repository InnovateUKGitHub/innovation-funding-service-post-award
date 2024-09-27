import { IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { storeKeys } from "@server/features/common/storeKeys";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { MonitoringReportDtoValidator } from "@ui/validation/validators/MonitoringReportDtoValidator";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { DeleteMonitoringReportCommand } from "@server/features/monitoringReports/deleteMonitoringReport";
import { GetMonitoringReportById } from "@server/features/monitoringReports/getMonitoringReport";
import {
  MonitoringReportDeleteParams,
  MonitoringReportDeleteRoute,
} from "@ui/pages/monitoringReports/monitoringReportDelete.page";
import { MonitoringReportDashboardRoute } from "@ui/pages/monitoringReports/monitoringReportDashboard/monitoringReportDashboard.page";

export class MonitoringReportDeleteFormHandler extends StandardFormHandlerBase<
  MonitoringReportDeleteParams,
  MonitoringReportDto
> {
  constructor() {
    super(MonitoringReportDeleteRoute, ["delete"]);
  }

  protected getDto(context: IContext, params: MonitoringReportDeleteParams): Promise<MonitoringReportDto> {
    return context.runQuery(new GetMonitoringReportById(params.projectId, params.id));
  }

  protected async run(
    context: IContext,
    params: MonitoringReportDeleteParams,
    button: IFormButton,
    dto: MonitoringReportDto,
  ): Promise<ILinkInfo> {
    await context.runCommand(new DeleteMonitoringReportCommand(dto.projectId, dto.headerId));
    return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId, periodId: undefined });
  }

  protected getStoreKey(params: MonitoringReportDeleteParams) {
    return storeKeys.getMonitoringReportKey(params.projectId, params.id);
  }

  protected createValidationResult(
    params: MonitoringReportDeleteParams,
    dto: MonitoringReportDto,
  ): MonitoringReportDtoValidator {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }
}
