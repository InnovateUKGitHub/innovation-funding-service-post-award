import { IContext } from "@framework/types/IContext";
import { GetMonitoringReportById } from "@server/features/monitoringReports/getMonitoringReport";
import { SaveMonitoringReport } from "@server/features/monitoringReports/saveMonitoringReport";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  createMonitoringReportErrorMap,
  createMonitoringReportSchema,
  MonitoringReportCreateSchema,
} from "@ui/pages/monitoringReports/create/monitoringReportCreate.zod";
import { MonitoringReportDashboardRoute } from "@ui/pages/monitoringReports/monitoringReportDashboard/monitoringReportDashboard.page";
import {
  MonitoringReportPreparePeriodParams,
  MonitoringReportPreparePeriodRoute,
} from "@ui/pages/monitoringReports/monitoringReportPeriodStep.page";
import { MonitoringReportWorkflowRoute } from "@ui/pages/monitoringReports/workflow/monitoringReportWorkflow.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class MonitoringReportPreparePeriodFormHandler extends ZodFormHandlerBase<
  MonitoringReportCreateSchema,
  MonitoringReportPreparePeriodParams
> {
  constructor() {
    super({
      routes: [MonitoringReportPreparePeriodRoute],
      forms: [FormTypes.MonitoringReportPreparePeriod],
    });
  }

  acceptFiles = false;

  protected async getZodSchema({
    params,
    context,
  }: {
    params: MonitoringReportPreparePeriodParams;
    context: IContext;
  }) {
    const project = await context.runQuery(new GetByIdQuery(params.projectId));

    return {
      schema: createMonitoringReportSchema(project.periodId),
      errorMap: createMonitoringReportErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<MonitoringReportCreateSchema>> {
    return {
      form: input.form,
      period: input.period,
      button_submit: input.button_submit,
    };
  }

  protected async run({
    input,
    params,
    context,
  }: {
    input: z.output<MonitoringReportCreateSchema>;
    params: MonitoringReportPreparePeriodParams;
    context: IContext;
  }): Promise<string> {
    const monitoringReport = await context.runQuery(new GetMonitoringReportById(params.projectId, params.id));

    const command = new SaveMonitoringReport({ ...monitoringReport, periodId: input.period }, false);

    await context.runCommand(command);
    if (input.button_submit === "saveAndReturn") {
      return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId, periodId: undefined }).path;
    }
    return MonitoringReportWorkflowRoute.getLink({
      projectId: params.projectId,
      id: params.id,
      mode: "prepare",
      step: 1,
    }).path;
  }
}

export { MonitoringReportPreparePeriodFormHandler };
