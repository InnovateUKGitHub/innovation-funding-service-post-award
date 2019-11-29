import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { IContext, ILinkInfo } from "@framework/types";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import {
  MonitoringReportDashboardRoute,
  MonitoringReportPrepareParams,
  MonitoringReportPrepareRoute
} from "@ui/containers";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { getMonitoringReportEditor } from "@ui/redux/selectors";
import { GetMonitoringReportById, SaveMonitoringReport } from "@server/features/monitoringReports";

export class MonitoringReportPrepareFormHandler extends StandardFormHandlerBase<MonitoringReportPrepareParams, "monitoringReport"> {

  constructor() {
    super(MonitoringReportPrepareRoute, ["save-draft", "save-submitted"], "monitoringReport");
  }

  protected async getDto(context: IContext, params: MonitoringReportPrepareParams, button: IFormButton, body: IFormBody): Promise<MonitoringReportDto> {
    const query = new GetMonitoringReportById(params.projectId, params.id);
    const dto = await context.runQuery(query);
    dto.periodId = parseInt(body.period, 10);
    dto.questions.forEach(q => {
      if (q.isScored) {
        q.optionId = body[`question_${q.displayOrder}_options`];
      }
      q.comments = body[`question_${q.displayOrder}_comments`];
    });
    return dto;
  }

  protected createValidationResult(params: MonitoringReportPrepareParams, dto: MonitoringReportDto) {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }

  protected getStoreKey(params: MonitoringReportPrepareParams) {
    return getMonitoringReportEditor(params.projectId, params.id).key;
  }

  protected async run(context: IContext, params: MonitoringReportPrepareParams, button: IFormButton, dto: MonitoringReportDto): Promise<ILinkInfo> {
    const command = new SaveMonitoringReport(dto, button.name === "save-submitted");
    await context.runCommand(command);

    return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId });
  }
}
