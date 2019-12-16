import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { IContext, ILinkInfo } from "@framework/types";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import {
  MonitoringReportDashboardRoute,
  MonitoringReportPreparePeriodParams,
  MonitoringReportPreparePeriodRoute,
  MonitoringReportPrepareRoute,
} from "@ui/containers";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { GetMonitoringReportById, SaveMonitoringReport } from "@server/features/monitoringReports";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { numberComparator } from "@framework/util";

export class MonitoringReportPreparePeriodFormHandler extends StandardFormHandlerBase<MonitoringReportPreparePeriodParams, "monitoringReport"> {

  constructor() {
    super(MonitoringReportPreparePeriodRoute, ["save-continue", "save-return"], "monitoringReport");
  }

  protected async getDto(context: IContext, params: MonitoringReportPreparePeriodParams, button: IFormButton, body: IFormBody): Promise<MonitoringReportDto> {
    const query = new GetMonitoringReportById(params.projectId, params.id);
    const dto = await context.runQuery(query);
    dto.periodId = parseInt(body.period, 10);
    return dto;
  }

  protected createValidationResult(params: MonitoringReportPreparePeriodParams, dto: MonitoringReportDto) {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }

  protected getStoreKey(params: MonitoringReportPreparePeriodParams) {
    return storeKeys.getMonitoringReportKey(params.projectId, params.id);
  }

  protected async run(context: IContext, params: MonitoringReportPreparePeriodParams, button: IFormButton, dto: MonitoringReportDto): Promise<ILinkInfo> {
    const command = new SaveMonitoringReport(dto, false);
    await context.runCommand(command);
    if (button.name === "save-return") {
      return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId });
    }
    const questions = dto.questions.map(x => x.displayOrder).sort(numberComparator);
    const firstQuestion = questions[0];
    return MonitoringReportPrepareRoute.getLink({ projectId: params.projectId, id: params.id, questionNumber: firstQuestion });
  }
}
