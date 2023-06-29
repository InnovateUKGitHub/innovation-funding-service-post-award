import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { MonitoringReportDtoValidator } from "@ui/validation/validators/MonitoringReportDtoValidator";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MonitoringReportWorkflowDef } from "@ui/containers/pages/monitoringReports/workflow/monitoringReportWorkflowDef";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { MonitoringReportDashboardRoute } from "@ui/containers/pages/monitoringReports/monitoringReportDashboard/monitoringReportDashboard.page";
import { MonitoringReportWorkflowRoute } from "@ui/containers/pages/monitoringReports/workflow/monitoringReportWorkflow.page";
import { GetMonitoringReportById } from "@server/features/monitoringReports/getMonitoringReport";
import { SaveMonitoringReport } from "@server/features/monitoringReports/saveMonitoringReport";
import { MonitoringReportWorkflowParams } from "@ui/containers/pages/monitoringReports/workflow/MonitoringReportWorkflowProps";

export class MonitoringReportPrepareFormHandler extends StandardFormHandlerBase<
  MonitoringReportWorkflowParams,
  "monitoringReport"
> {
  constructor() {
    super(MonitoringReportWorkflowRoute, ["save-continue", "save-return"], "monitoringReport");
  }

  protected async getDto(
    context: IContext,
    params: MonitoringReportWorkflowParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<MonitoringReportDto> {
    const query = new GetMonitoringReportById(params.projectId, params.id);
    const dto = await context.runQuery(query);
    const questionDisplayOrder = Number(body.questionDisplayOrder);
    const q = dto.questions.find(x => x.displayOrder === questionDisplayOrder);
    if (!q) throw new Error(`Cannot find monitoring report question dto matching ${questionDisplayOrder}`);
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
      return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId, periodId: undefined });
    }

    const nextStep = MonitoringReportWorkflowDef.getWorkflow(dto, params.step).getNextStepInfo();
    return MonitoringReportWorkflowRoute.getLink({
      projectId: params.projectId,
      id: params.id,
      mode: "prepare",
      step: nextStep && nextStep.stepNumber,
    });
  }

  protected async run(
    context: IContext,
    params: MonitoringReportWorkflowParams,
    button: IFormButton,
    dto: MonitoringReportDto,
  ): Promise<ILinkInfo> {
    const command = new SaveMonitoringReport(dto, false);
    await context.runCommand(command);
    if (button.name === "save-return") {
      const workflow = MonitoringReportWorkflowDef.getWorkflow(dto, params.step);
      if (workflow.isOnSummary()) {
        return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId, periodId: undefined });
      }
      return MonitoringReportWorkflowRoute.getLink({
        projectId: params.projectId,
        id: params.id,
        mode: "prepare",
        step: undefined,
      });
    }
    return this.getLink(button.name === "save-continue", dto, params);
  }
}
