import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { IContext, ILinkInfo } from "@framework/types";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import {
  MonitoringReportDashboardRoute,
  MonitoringReportPrepareSummaryParams,
  MonitoringReportSummaryRoute
} from "@ui/containers";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { GetMonitoringReportById, SaveMonitoringReport } from "@server/features/monitoringReports";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class MonitoringReportSummaryFormHandler extends StandardFormHandlerBase<MonitoringReportPrepareSummaryParams, "monitoringReport"> {

  constructor() {
    super(MonitoringReportSummaryRoute, ["save-draft", "save-submitted"], "monitoringReport");
  }

  protected async getDto(context: IContext, params: MonitoringReportPrepareSummaryParams, button: IFormButton, body: IFormBody): Promise<MonitoringReportDto> {
    const query = new GetMonitoringReportById(params.projectId, params.id);
    return context.runQuery(query);
  }

  protected createValidationResult(params: MonitoringReportPrepareSummaryParams, dto: MonitoringReportDto) {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }

  protected getStoreKey(params: MonitoringReportPrepareSummaryParams) {
    return storeKeys.getMonitoringReportKey(params.projectId, params.id);
  }

  protected async run(context: IContext, params: MonitoringReportPrepareSummaryParams, button: IFormButton, dto: MonitoringReportDto): Promise<ILinkInfo> {
    const command = new SaveMonitoringReport(dto, button.name === "save-submitted");
    await context.runCommand(command);
    return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId });
  }
}
