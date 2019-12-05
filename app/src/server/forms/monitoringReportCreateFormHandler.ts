import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { CreateMonitoringReportCommand, GetMonitoringReportActiveQuestions } from "@server/features/monitoringReports";
import { MonitoringReportCreateParams, MonitoringReportCreateRoute, MonitoringReportDashboardRoute } from "@ui/containers/monitoringReports";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { MonitoringReportStatus } from "@framework/constants";
import { MonitoringReportDto } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class MonitoringReportCreateFormHandler extends StandardFormHandlerBase<MonitoringReportCreateParams, "monitoringReport"> {
  constructor() {
    super(MonitoringReportCreateRoute, [ "save-draft", "save-submitted"], "monitoringReport");
  }

  protected async getDto(context: IContext, params: MonitoringReportCreateParams, button: IFormButton, body: IFormBody): Promise<MonitoringReportDto> {
    const questions = await context.runQuery(new GetMonitoringReportActiveQuestions());

    questions.forEach(q => {
      if(q.isScored) {
        q.optionId = body[`question_${q.displayOrder}_options`];
      }
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
      startDate: null,
      endDate: null,
    };
  }

  protected createValidationResult(params: MonitoringReportCreateParams, dto: MonitoringReportDto) {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }

  protected getStoreKey(params: MonitoringReportCreateParams) {
    return storeKeys.getMonitoringReportKey(params.projectId);
  }

  protected async run(context: IContext, params: MonitoringReportCreateParams, button: IFormButton, dto: MonitoringReportDto): Promise<ILinkInfo> {
    const command = new CreateMonitoringReportCommand(dto, button.name === "save-submitted");
    await context.runCommand(command);

    return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId });
  }
}
