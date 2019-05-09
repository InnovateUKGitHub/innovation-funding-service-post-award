import { QueryBase } from "@server/features/common";
import { Authorisation, IContext, MonitoringReportActivityDto, ProjectRole } from "@framework/types";

export class GetMonitoringReportStatusChanges extends QueryBase<MonitoringReportActivityDto[]> {
  constructor(
    private readonly projectId: string,
    private readonly reportId: string
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.monitoringReports && auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext): Promise<MonitoringReportActivityDto[]> {
    const statusChanges = await context.repositories.monitoringReportStatusChange.getStatusChanges(this.reportId);
    return statusChanges.map<MonitoringReportActivityDto>(x => ({
      id: x.Id,
      monitoringReport: x.Acc_MonitoringReport__c,
      newStatus: x.Acc_NewMonitoringReportStatus__c,
      previousStatus: x.Acc_PreviousMonitoringReportStatus__c,
      createdBy: x.CreatedById,
      createdDate: context.clock.parseRequiredSalesforceDateTime(x.CreatedDate)
    }));
  }
}
