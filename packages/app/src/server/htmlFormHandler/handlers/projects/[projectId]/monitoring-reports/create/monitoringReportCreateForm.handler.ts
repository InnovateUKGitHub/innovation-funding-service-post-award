import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";
import { IContext } from "@framework/types/IContext";
import { CreateMonitoringReportCommand } from "@server/features/monitoringReports/createMonitoringReport";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  MonitoringReportCreateParams,
  MonitoringReportCreateRoute,
} from "@ui/pages/monitoringReports/create/monitoringReportCreate.page";
import {
  createMonitoringReportErrorMap,
  createMonitoringReportSchema,
  MonitoringReportCreateSchema,
} from "@ui/pages/monitoringReports/create/monitoringReportCreate.zod";
import { MonitoringReportDashboardRoute } from "@ui/pages/monitoringReports/monitoringReportDashboard/monitoringReportDashboard.page";
import { MonitoringReportWorkflowRoute } from "@ui/pages/monitoringReports/workflow/monitoringReportWorkflow.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class MonitoringReportCreateFormHandler extends ZodFormHandlerBase<
  MonitoringReportCreateSchema,
  MonitoringReportCreateParams
> {
  constructor() {
    super({
      routes: [MonitoringReportCreateRoute],
      forms: [FormTypes.MonitoringReportCreate],
    });
  }

  acceptFiles = false;

  protected async getZodSchema({ params, context }: { params: MonitoringReportCreateParams; context: IContext }) {
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
    params: MonitoringReportCreateParams;
    context: IContext;
  }): Promise<string> {
    const command = new CreateMonitoringReportCommand(
      { periodId: input.period, projectId: params.projectId, status: MonitoringReportStatus.Draft },
      false,
    );
    const id = (await context.runCommand(command)) as MonitoringReportId;

    if (input.button_submit === "saveAndReturn") {
      return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId, periodId: undefined }).path;
    }
    return MonitoringReportWorkflowRoute.getLink({ projectId: params.projectId, id, mode: "prepare", step: 1 }).path;
  }
}

export { MonitoringReportCreateFormHandler };
