import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { IContext } from "@framework/types/IContext";
import { GetMonitoringReportById } from "@server/features/monitoringReports/getMonitoringReport";
import { SaveMonitoringReport } from "@server/features/monitoringReports/saveMonitoringReport";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { MonitoringReportDashboardRoute } from "@ui/pages/monitoringReports/monitoringReportDashboard/monitoringReportDashboard.page";
import {
  monitoringReportSummaryErrorMap,
  monitoringReportSummarySchema,
  MonitoringReportSummarySchema,
} from "@ui/pages/monitoringReports/workflow/monitoringReportSummary.zod";
import {
  MonitoringReportWorkflowParams,
  MonitoringReportWorkflowRoute,
} from "@ui/pages/monitoringReports/workflow/monitoringReportWorkflow.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class MonitoringReportSummaryFormHandler extends ZodFormHandlerBase<
  MonitoringReportSummarySchema,
  MonitoringReportWorkflowParams
> {
  private monitoringReport: MonitoringReportDto | undefined;

  constructor() {
    super({
      routes: [MonitoringReportWorkflowRoute],
      forms: [FormTypes.MonitoringReportSummary],
    });
  }

  acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: monitoringReportSummarySchema,
      errorMap: monitoringReportSummaryErrorMap,
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
  }): Promise<z.input<MonitoringReportSummarySchema>> {
    this.monitoringReport = await context.runQuery(new GetMonitoringReportById(params.projectId, params.id));

    return {
      form: input.form,
      button_submit: input.button_submit,
      ...this.monitoringReport,
      addComments: input.addComments,
    };
  }

  protected async run({
    input,
    params,
    context,
  }: {
    input: z.output<MonitoringReportSummarySchema>;
    params: MonitoringReportWorkflowParams;
    context: IContext;
  }): Promise<string> {
    if (!this.monitoringReport) {
      this.monitoringReport = await context.runQuery(new GetMonitoringReportById(params.projectId, params.id));
    }
    const command = new SaveMonitoringReport(
      { ...this.monitoringReport, addComments: input.addComments },
      input.button_submit === "submit",
    );
    await context.runCommand(command);
    return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId, periodId: undefined }).path;
  }
}

export { MonitoringReportSummaryFormHandler };
