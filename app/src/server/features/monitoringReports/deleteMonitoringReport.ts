import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { BadRequestError } from "../common/appError";
import { AuthorisedAsyncCommandBase } from "../common/commandBase";

export class DeleteMonitoringReportCommand extends AuthorisedAsyncCommandBase<void> {
  public readonly runnableName: string = "DeleteMonitoringReportCommand";

  constructor(
    private readonly projectId: ProjectId,
    private readonly reportId: MonitoringReportId,
  ) {
    super();
  }

  async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRolePermissionBits.MonitoringOfficer);
  }

  protected async run(context: IContext) {
    const header = await context.repositories.monitoringReportHeader.getById(this.reportId);

    if (header.Acc_MonitoringReportStatus__c !== "Draft") {
      throw new BadRequestError("Can only delete draft reports");
    }
    return context.repositories.monitoringReportHeader.delete(this.reportId);
  }
}
