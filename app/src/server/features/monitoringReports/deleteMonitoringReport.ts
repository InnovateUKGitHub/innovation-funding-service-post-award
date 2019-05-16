import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { CommandBase } from "@server/features/common";

export class DeleteMonitoringReportCommand extends CommandBase<void> {
  constructor(
    private readonly projectId: string,
    private readonly reportId: string
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.monitoringReports && auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext) {
    return context.repositories.monitoringReportHeader.delete(this.reportId);
  }
}
