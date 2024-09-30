import { IContext } from "@framework/types/IContext";
import { DeleteMonitoringReportCommand } from "@server/features/monitoringReports/deleteMonitoringReport";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { createMonitoringReportErrorMap } from "@ui/containers/pages/monitoringReports/create/monitoringReportCreate.zod";
import { MonitoringReportDashboardRoute } from "@ui/containers/pages/monitoringReports/monitoringReportDashboard/monitoringReportDashboard.page";
import {
  MonitoringReportDeleteParams,
  MonitoringReportDeleteRoute,
} from "@ui/containers/pages/monitoringReports/monitoringReportDelete.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

const emptySchema = z.object({
  form: z.literal(FormTypes.MonitoringReportDelete),
});
type EmptySchema = typeof emptySchema;

class MonitoringReportDeleteFormHandler extends ZodFormHandlerBase<EmptySchema, MonitoringReportDeleteParams> {
  constructor() {
    super({
      routes: [MonitoringReportDeleteRoute],
      forms: [FormTypes.MonitoringReportDelete],
    });
  }

  acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: emptySchema,
      errorMap: createMonitoringReportErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<EmptySchema>> {
    return {
      form: input.form,
    };
  }

  protected async run({
    params,
    context,
  }: {
    params: MonitoringReportDeleteParams;
    context: IContext;
  }): Promise<string> {
    await context.runCommand(new DeleteMonitoringReportCommand(params.projectId, params.id));
    return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId, periodId: undefined }).path;
  }
}

export { MonitoringReportDeleteFormHandler };
