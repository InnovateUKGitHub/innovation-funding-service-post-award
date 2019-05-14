import { QueryBase } from "@server/features/common";
import { Authorisation, IContext, MonitoringReportStatusChangeDto, ProjectRole } from "@framework/types";
import { dateComparator } from "@util/comparator";
import { mapMonitoringReportStatus } from "@server/features/monitoringReports/mapMonitoringReportStatus";

export class GetMonitoringReportStatusChanges extends QueryBase<MonitoringReportStatusChangeDto[]> {
  constructor(
    private readonly projectId: string,
    private readonly reportId: string
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    // TODO validate report is actually for project passed in
    return context.config.features.monitoringReports && auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext): Promise<MonitoringReportStatusChangeDto[]> {
    const statusChanges = await context.repositories.monitoringReportStatusChange.getStatusChanges(this.reportId);
    return statusChanges
      .map<MonitoringReportStatusChangeDto>(x => ({
          id: x.Id,
          monitoringReport: x.Acc_MonitoringReport__c,
          newStatus: x.Acc_NewMonitoringReportStatus__c,
          previousStatus: x.Acc_PreviousMonitoringReportStatus__c,
          createdBy: x.CreatedBy.Name,
          createdDate: context.clock.parseRequiredSalesforceDateTime(x.CreatedDate)
        })
      )
      .sort((a, b) => dateComparator(b.createdDate, a.createdDate) || mapMonitoringReportStatus(b) - mapMonitoringReportStatus(a));
  }
}
