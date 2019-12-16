import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { IContext, ILinkInfo } from "@framework/types";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import {
  MonitoringReportDashboardRoute,
  MonitoringReportPrepareParams,
  MonitoringReportPrepareRoute, MonitoringReportSummaryRoute
} from "@ui/containers";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { GetMonitoringReportById, SaveMonitoringReport } from "@server/features/monitoringReports";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { numberComparator } from "@framework/util";

export class MonitoringReportPrepareFormHandler extends StandardFormHandlerBase<MonitoringReportPrepareParams, "monitoringReport"> {

  constructor() {
    super(MonitoringReportPrepareRoute, ["save-continue", "save-return"], "monitoringReport");
  }

  protected async getDto(context: IContext, params: MonitoringReportPrepareParams, button: IFormButton, body: IFormBody): Promise<MonitoringReportDto> {
    const query = new GetMonitoringReportById(params.projectId, params.id);
    const dto = await context.runQuery(query);
    const q = dto.questions.find(x => x.displayOrder === params.questionNumber)!;
    if (q.isScored) {
      q.optionId = body[`question_${q.displayOrder}_options`];
    }
    q.comments = body[`question_${q.displayOrder}_comments`];
    return dto;
  }

  protected createValidationResult(params: MonitoringReportPrepareParams, dto: MonitoringReportDto) {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }

  protected getStoreKey(params: MonitoringReportPrepareParams) {
    return storeKeys.getMonitoringReportKey(params.projectId, params.id);
  }

  private getLink(progress: boolean, dto: MonitoringReportDto, params: MonitoringReportPrepareParams) {
    if (!progress) {
      return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId });
    }
    const questions = dto.questions.map(x => x.displayOrder).sort(numberComparator);
    const lastQuestion = questions[questions.length - 1];
    if (params.questionNumber === lastQuestion) {
      return MonitoringReportSummaryRoute.getLink({ projectId: params.projectId, id: params.id, mode: "prepare" });
    }

    const currentQuestionIndex = questions.indexOf(params.questionNumber);
    const nextQuestion = questions[currentQuestionIndex + 1];
    return MonitoringReportPrepareRoute.getLink({ projectId: params.projectId, id: params.id, questionNumber: nextQuestion });
  }

  protected async run(context: IContext, params: MonitoringReportPrepareParams, button: IFormButton, dto: MonitoringReportDto): Promise<ILinkInfo> {
    const command = new SaveMonitoringReport(dto, false);
    await context.runCommand(command);
    if (button.name === "save-return") {
      return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId });
    }
    return this.getLink(button.name === "save-continue", dto, params);
  }
}
