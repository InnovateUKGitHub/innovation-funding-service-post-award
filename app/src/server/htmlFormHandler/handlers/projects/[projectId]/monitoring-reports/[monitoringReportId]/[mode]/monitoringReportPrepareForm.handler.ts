import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { IContext } from "@framework/types/IContext";
import { GetMonitoringReportById } from "@server/features/monitoringReports/getMonitoringReport";
import { SaveMonitoringReport } from "@server/features/monitoringReports/saveMonitoringReport";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";

import { MonitoringReportDashboardRoute } from "@ui/pages/monitoringReports/monitoringReportDashboard/monitoringReportDashboard.page";
import {
  MonitoringReportWorkflowParams,
  MonitoringReportWorkflowRoute,
} from "@ui/pages/monitoringReports/workflow/monitoringReportWorkflow.page";
import {
  monitoringReportWorkflowErrorMap,
  monitoringReportWorkflowSchema,
  MonitoringReportWorkflowSchema,
} from "@ui/pages/monitoringReports/workflow/monitoringReportWorkflow.zod";
import { MonitoringReportWorkflowDef } from "@ui/pages/monitoringReports/workflow/monitoringReportWorkflowDef";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class MonitoringReportPrepareFormHandler extends ZodFormHandlerBase<
  MonitoringReportWorkflowSchema,
  MonitoringReportWorkflowParams
> {
  private monitoringReport: MonitoringReportDto | undefined;

  constructor() {
    super({
      routes: [MonitoringReportWorkflowRoute],
      forms: [FormTypes.MonitoringReportQuestion],
    });
  }

  acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: monitoringReportWorkflowSchema,
      errorMap: monitoringReportWorkflowErrorMap,
    };
  }

  protected async mapToZod({
    input,
    params,
    context,
  }: {
    input: AnyObject;
    params: MonitoringReportWorkflowParams;
    context: IContext;
  }): Promise<z.input<MonitoringReportWorkflowSchema>> {
    const query = new GetMonitoringReportById(params.projectId, params.id);
    this.monitoringReport = await context.runQuery(query);
    const questionDisplayOrder = Number(input.questionDisplayOrder);

    const q = this.monitoringReport.questions.find(x => x.displayOrder === questionDisplayOrder);

    if (q) {
      if (q.isScored) {
        q.optionId = input[`questions.${q.displayOrder - 1}.optionId`];
      }
      q.comments = input[`questions.${q.displayOrder - 1}.comments`];
    }

    const questions = this.monitoringReport.questions.map(x =>
      x.displayOrder === questionDisplayOrder ? { ...x, ...q } : x,
    );

    return {
      form: input.form,
      button_submit: input.button_submit,
      questions,
    };
  }

  private getLink(progress: boolean, dto: MonitoringReportDto, params: MonitoringReportWorkflowParams) {
    if (!progress) {
      return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId, periodId: undefined });
    }

    const nextStep = MonitoringReportWorkflowDef.getWorkflow(dto, Number(params.step)).getNextStepInfo();

    return MonitoringReportWorkflowRoute.getLink({
      projectId: params.projectId,
      id: params.id,
      mode: "prepare",
      step: nextStep && nextStep.stepNumber,
    });
  }

  protected async run({
    input,
    params,
    context,
  }: {
    input: z.output<MonitoringReportWorkflowSchema>;
    params: MonitoringReportWorkflowParams;
    context: IContext;
  }): Promise<string> {
    if (!this.monitoringReport) throw new Error("Cannot find monitoring report");

    const monitoringReportDto = {
      ...this.monitoringReport,
      questions: this.monitoringReport.questions.map((x, i) => ({ ...x, ...input.questions[i] })),
    };

    const command = new SaveMonitoringReport(monitoringReportDto, false);

    await context.runCommand(command);

    if (input.button_submit === "saveAndReturn") {
      const workflow = MonitoringReportWorkflowDef.getWorkflow(monitoringReportDto, params.step);
      if (workflow.isOnSummary()) {
        return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId, periodId: undefined }).path;
      }
      return MonitoringReportWorkflowRoute.getLink({
        projectId: params.projectId,
        id: params.id,
        mode: "prepare",
        step: undefined,
      }).path;
    }
    return this.getLink(input.button_submit === "saveAndContinue", monitoringReportDto, params).path;
  }
}

export { MonitoringReportPrepareFormHandler };
