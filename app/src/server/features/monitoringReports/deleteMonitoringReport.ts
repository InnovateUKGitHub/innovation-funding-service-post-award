import { Authorisation, IContext, ProjectRole } from "@framework/types";
import {BadRequestError, CommandBase} from "@server/features/common";

export class DeleteMonitoringReportCommand extends CommandBase<void> {
  constructor(
    private readonly projectId: string,
    private readonly reportId: string
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext) {
    const header = await context.repositories.monitoringReportHeader.getById(this.reportId);

    if (header.Acc_MonitoringReportStatus__c !== "Draft") {
      throw new BadRequestError("Can only delete draft reports");
    }
    return context.repositories.monitoringReportHeader.delete(this.reportId);
  }
}
