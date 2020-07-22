import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { IContext, ILinkInfo } from "@framework/types";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import {
  MonitoringReportDashboardRoute, MonitoringReportWorkflowParams, MonitoringReportWorkflowRoute,
} from "@ui/containers";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { GetMonitoringReportById, SaveMonitoringReport } from "@server/features/monitoringReports";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class MonitoringReportSummaryFormHandler extends StandardFormHandlerBase<MonitoringReportWorkflowParams, "monitoringReport"> {

  constructor() {
    super(MonitoringReportWorkflowRoute, ["saveAndReturnToSummary", "submit"], "monitoringReport");
  }

  protected async getDto(context: IContext, params: MonitoringReportWorkflowParams, button: IFormButton, body: IFormBody): Promise<MonitoringReportDto> {
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

  protected async run(context: IContext, params: MonitoringReportWorkflowParams, button: IFormButton, dto: MonitoringReportDto): Promise<ILinkInfo> {
    const command = new SaveMonitoringReport(dto, button.name === "submit");
    await context.runCommand(command);
    return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId });
  }
}
