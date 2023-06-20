import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MonitoringReportWorkflowParams } from "@ui/containers/monitoringReports/workflow/MonitoringReportWorkflowProps";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { MonitoringReportDashboardRoute } from "@ui/containers/monitoringReports/monitoringReportDashboard/monitoringReportDashboard.page";
import { MonitoringReportWorkflowRoute } from "@ui/containers/monitoringReports/workflow/monitoringReportWorkflow.page";
import { GetMonitoringReportById } from "@server/features/monitoringReports/getMonitoringReport";
import { SaveMonitoringReport } from "@server/features/monitoringReports/saveMonitoringReport";

export class MonitoringReportSummaryFormHandler extends StandardFormHandlerBase<
  MonitoringReportWorkflowParams,
  "monitoringReport"
> {
  constructor() {
    super(MonitoringReportWorkflowRoute, ["saveAndReturnToSummary", "submit"], "monitoringReport");
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
    const command = new SaveMonitoringReport(dto, button.name === "submit");
    await context.runCommand(command);
    return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId, periodId: undefined });
  }
}
