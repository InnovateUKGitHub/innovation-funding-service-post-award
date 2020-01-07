import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { IContext, ILinkInfo } from "@framework/types";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import {
  MonitoringReportDashboardRoute, MonitoringReportWorkflowParams,
  MonitoringReportWorkflowRoute,
} from "@ui/containers";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { GetMonitoringReportById, SaveMonitoringReport } from "@server/features/monitoringReports";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MonitoringReportWorkflowDef } from "@ui/containers/monitoringReports/monitoringReportWorkflowDef";

export class MonitoringReportPrepareFormHandler extends StandardFormHandlerBase<MonitoringReportWorkflowParams, "monitoringReport"> {

  constructor() {
    super(MonitoringReportWorkflowRoute, ["save-continue", "save-return"], "monitoringReport");
  }

  protected async getDto(context: IContext, params: MonitoringReportWorkflowParams, button: IFormButton, body: IFormBody): Promise<MonitoringReportDto> {
    const query = new GetMonitoringReportById(params.projectId, params.id);
    const dto = await context.runQuery(query);
    const questionDisplayOrder = Number(body.questionDisplayOrder);
    const q = dto.questions.find(x => x.displayOrder === questionDisplayOrder)!;
    if (q.isScored) {
      q.optionId = body[`question_${q.displayOrder}_options`];
    }
    q.comments = body[`question_${q.displayOrder}_comments`];
    return dto;
  }

  protected createValidationResult(params: MonitoringReportWorkflowParams, dto: MonitoringReportDto) {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }

  protected getStoreKey(params: MonitoringReportWorkflowParams) {
    return storeKeys.getMonitoringReportKey(params.projectId, params.id);
  }

  private getLink(progress: boolean, dto: MonitoringReportDto, params: MonitoringReportWorkflowParams) {
    if (!progress) {
      return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId });
    }

    const nextStep = MonitoringReportWorkflowDef.getWorkflow(dto, params.step).getNextStepInfo();
    return MonitoringReportWorkflowRoute.getLink({ projectId: params.projectId, id: params.id, mode: "prepare", step: nextStep && nextStep.stepNumber });
  }

  protected async run(context: IContext, params: MonitoringReportWorkflowParams, button: IFormButton, dto: MonitoringReportDto): Promise<ILinkInfo> {
    const command = new SaveMonitoringReport(dto, false);
    await context.runCommand(command);
    if (button.name === "save-return") {
      return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId });
    }
    return this.getLink(button.name === "save-continue", dto, params);
  }
}
