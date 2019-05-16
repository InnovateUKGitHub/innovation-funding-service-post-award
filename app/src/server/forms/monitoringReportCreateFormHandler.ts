import { FormHandlerBase, IFormBody, IFormButton } from "./formHandlerBase";
import { GetMonitoringReportActiveQuestions } from "@server/features/monitoringReports/getMonitoringReportActiveQuestions";
import { CreateMonitoringReport } from "@server/features/monitoringReports/createMonitoringReport";
import { MonitoringReportDashboardRoute } from "@ui/containers/monitoringReports/dashboard";
import { MonitoringReportCreateRoute, MonitoringReportPrepareParams } from "@ui/containers/monitoringReports/prepare";
import { getMonitoringReportEditor } from "@ui/redux/selectors";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { MonitoringReportStatus } from "@framework/constants";
import { MonitoringReportDto } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";

export class MonitoringReportCreateFormHandler extends FormHandlerBase<MonitoringReportPrepareParams, MonitoringReportDto> {
  constructor() {
    super(MonitoringReportCreateRoute, [ "save-draft", "save-submitted"]);
  }

  protected async getDto(context: IContext, params: MonitoringReportPrepareParams, button: IFormButton, body: IFormBody): Promise<MonitoringReportDto> {
    const questions = await context.runQuery(new GetMonitoringReportActiveQuestions());

    questions.forEach(q => {
      q.optionId = body[`question_${q.displayOrder}_options`];
      q.comments = body[`question_${q.displayOrder}_comments`];
    });

    return {
      headerId: "",
      projectId: params.projectId,
      periodId: parseInt(body.period, 10),
      questions,
      status: MonitoringReportStatus.Draft,
      statusName: "",
      lastUpdated: null,
      // ToDo: remove
      startDate: null,
      endDate: null,
    };
  }

  protected createValidationResult(params: MonitoringReportPrepareParams, dto: MonitoringReportDto) {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }

  protected getStoreInfo(params: MonitoringReportPrepareParams): { key: string; store: string; } {
    return getMonitoringReportEditor(params.projectId, params.id);
  }

  protected async run(context: IContext, params: MonitoringReportPrepareParams, button: IFormButton, dto: MonitoringReportDto): Promise<ILinkInfo> {
    const command = new CreateMonitoringReport(dto, button.name === "save-submitted");
    await context.runCommand(command);

    return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId });
  }
}
