import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { MonitoringReportDtoValidator } from "@ui/validation/validators/MonitoringReportDtoValidator";
import { storeKeys } from "@server/features/common/storeKeys";
import { MonitoringReportWorkflowParams } from "@ui/pages/monitoringReports/workflow/MonitoringReportWorkflowProps";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { MonitoringReportDashboardRoute } from "@ui/pages/monitoringReports/monitoringReportDashboard/monitoringReportDashboard.page";
import { MonitoringReportWorkflowRoute } from "@ui/pages/monitoringReports/workflow/monitoringReportWorkflow.page";
import { GetMonitoringReportById } from "@server/features/monitoringReports/getMonitoringReport";
import { SaveMonitoringReport } from "@server/features/monitoringReports/saveMonitoringReport";

export class MonitoringReportSummaryFormHandler extends StandardFormHandlerBase<
  MonitoringReportWorkflowParams,
  MonitoringReportDto
> {
  constructor() {
    super(MonitoringReportWorkflowRoute, [{ name: "submit", value: "submit" }]);
  }

  protected async getDto(
    context: IContext,
    params: MonitoringReportWorkflowParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<MonitoringReportDto> {
    const dto = await context.runQuery(new GetMonitoringReportById(params.projectId, params.id));

    dto.addComments = body.addComments;

    return dto;
  }

  protected createValidationResult(params: MonitoringReportWorkflowParams, dto: MonitoringReportDto) {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }

  protected getStoreKey(params: MonitoringReportWorkflowParams) {
    return storeKeys.getMonitoringReportKey(params.projectId, params.id);
  }

  protected async run(
    context: IContext,
    params: MonitoringReportWorkflowParams,
    button: IFormButton,
    dto: MonitoringReportDto,
  ): Promise<ILinkInfo> {
    const command = new SaveMonitoringReport(dto, button.value === "submit");
    await context.runCommand(command);
    return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId, periodId: undefined });
  }
}
