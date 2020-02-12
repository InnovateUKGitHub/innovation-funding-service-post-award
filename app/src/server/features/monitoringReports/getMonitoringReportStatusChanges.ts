import { QueryBase } from "@server/features/common";
import { mapMonitoringReportStatus } from "@server/features/monitoringReports/mapMonitoringReportStatus";
import { Authorisation, IContext, MonitoringReportStatus, MonitoringReportStatusChangeDto, ProjectRole } from "@framework/types";
import { dateComparator } from "@framework/util";
import { GetMonitoringReportStatusesQuery } from "./getMonitoringReportStatusesQuery";
import { ISalesforceMonitoringReportStatusChange } from "@server/repositories/monitoringReportStatusChangeRepository";
import { Option} from "@framework/types";

export class GetMonitoringReportStatusChanges extends QueryBase<MonitoringReportStatusChangeDto[]> {
  constructor(
    private readonly projectId: string,
    private readonly reportId: string
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    // @TODO: validate report is actually for project passed in
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext): Promise<MonitoringReportStatusChangeDto[]> {
    const statusChanges = await context.repositories.monitoringReportStatusChange.getStatusChanges(this.reportId);
    const statusLookup = await context.runQuery(new GetMonitoringReportStatusesQuery());

    return statusChanges
      .map(x => this.mapItem(context, x, statusLookup))
      .sort((a, b) => dateComparator(b.createdDate, a.createdDate) || b.newStatus - a.newStatus)
      ;
  }

  private mapItem(context: IContext, statusChange: ISalesforceMonitoringReportStatusChange, statusLookup: Map<MonitoringReportStatus, Option<MonitoringReportStatus>>): MonitoringReportStatusChangeDto {
    const newStatus = mapMonitoringReportStatus(statusChange.Acc_NewMonitoringReportStatus__c);
    const previousStatus = mapMonitoringReportStatus(statusChange.Acc_PreviousMonitoringReportStatus__c);
    const newStatusLookup = statusLookup.get(newStatus);
    const previousStatusLookup = statusLookup.get(previousStatus);
    return {
      id: statusChange.Id,
      monitoringReport: statusChange.Acc_MonitoringReport__c,
      newStatus,
      newStatusLabel: newStatusLookup && newStatusLookup.label || statusChange.Acc_NewMonitoringReportStatus__c,
      previousStatus,
      previousStatusLabel: previousStatusLookup && previousStatusLookup.label || statusChange.Acc_PreviousMonitoringReportStatus__c,
      createdBy: statusChange.Acc_CreatedByAlias__c,
      createdDate: context.clock.parseRequiredSalesforceDateTime(statusChange.CreatedDate)
    };
  }
}
