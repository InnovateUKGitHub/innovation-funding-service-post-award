import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { BadRequestError } from "../common/appError";
import { CommandBase } from "../common/commandBase";

export class DeleteMonitoringReportCommand extends CommandBase<void> {
  constructor(private readonly projectId: ProjectId, private readonly reportId: MonitoringReportId) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async run(context: IContext) {
    const header = await context.repositories.monitoringReportHeader.getById(this.reportId);

    if (header.Acc_MonitoringReportStatus__c !== "Draft") {
      throw new BadRequestError("Can only delete draft reports");
    }
    return context.repositories.monitoringReportHeader.delete(this.reportId);
  }
}
