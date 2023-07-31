import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { MonitoringReportDtoValidator } from "@ui/validation/validators/MonitoringReportDtoValidator";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { GetMonitoringReportById } from "@server/features/monitoringReports/getMonitoringReport";
import { SaveMonitoringReport } from "@server/features/monitoringReports/saveMonitoringReport";
import { MonitoringReportDashboardRoute } from "@ui/containers/pages/monitoringReports/monitoringReportDashboard/monitoringReportDashboard.page";
import {
  MonitoringReportPreparePeriodParams,
  MonitoringReportPreparePeriodRoute,
} from "@ui/containers/pages/monitoringReports/monitoringReportPeriodStep.page";
import { MonitoringReportWorkflowRoute } from "@ui/containers/pages/monitoringReports/workflow/monitoringReportWorkflow.page";

export class MonitoringReportPreparePeriodFormHandler extends StandardFormHandlerBase<
  MonitoringReportPreparePeriodParams,
  "monitoringReport"
> {
  constructor() {
    super(MonitoringReportPreparePeriodRoute, ["save-continue", "save-return"], "monitoringReport");
  }

  protected async getDto(
    context: IContext,
    params: MonitoringReportPreparePeriodParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<MonitoringReportDto> {
    const query = new GetMonitoringReportById(params.projectId, params.id);
    const dto = await context.runQuery(query);
    dto.periodId = parseInt(body.period, 10) as PeriodId;
    return dto;
  }

  protected createValidationResult(params: MonitoringReportPreparePeriodParams, dto: MonitoringReportDto) {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }

  protected getStoreKey(params: MonitoringReportPreparePeriodParams) {
    return storeKeys.getMonitoringReportKey(params.projectId, params.id);
  }

  protected async run(
    context: IContext,
    params: MonitoringReportPreparePeriodParams,
    button: IFormButton,
    dto: MonitoringReportDto,
  ): Promise<ILinkInfo> {
    const command = new SaveMonitoringReport(dto, false);
    await context.runCommand(command);
    if (button.name === "save-return") {
      return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId, periodId: undefined });
    }
    return MonitoringReportWorkflowRoute.getLink({
      projectId: params.projectId,
      id: params.id,
      mode: "prepare",
      step: 1,
    });
  }
}
