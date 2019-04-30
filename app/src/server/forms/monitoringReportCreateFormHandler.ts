import { FormHandlerBase, IFormBody, IFormButton } from "./formHandlerBase";
import { MonitoringReportCreateRoute, MonitoringReportPrepareParams } from "@framework/ui/containers/monitoringReports/prepare";
import { MonitoringReportDto } from "@framework/types/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { GetMonitoringReportActiveQuestions } from "@server/features/monitoringReports/getMonitoringReportActiveQuestions";
import { MonitoringReportStatus } from "@framework/types/constants/monitoringReportStatus";
import { MonitoringReportDtoValidator } from "@framework/ui/validators/MonitoringReportDtoValidator";
import { getMonitoringReportEditor } from "@framework/ui/redux/selectors";
import { CreateMonitoringReport } from "@server/features/monitoringReports/createMonitoringReport";
import { MonitoringReportDashboardRoute } from "@framework/ui/containers/monitoringReports/dashboard";

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
      title: body.title,
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
