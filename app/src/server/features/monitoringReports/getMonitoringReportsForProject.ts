import { QueryBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { MonitoringReportSummaryDto } from "@framework/dtos";
import { dateComparator } from "@framework/util/comparator";
import { mapMonitoringReportStatus } from "./mapMonitoringReportStatus";

export class GetMonitoringReportsForProject extends QueryBase<MonitoringReportSummaryDto[]> {
  constructor(
    private readonly projectId: string,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext): Promise<MonitoringReportSummaryDto[]> {
    const headers = await context.repositories.monitoringReportHeader.getAllForProject(this.projectId);
    return headers.map<MonitoringReportSummaryDto>(x => ({
      headerId: x.Id,
      projectId: x.Acc_Project__c,
      status: mapMonitoringReportStatus(x.Acc_MonitoringReportStatus__c),
      statusName: x.MonitoringReportStatusName,
      startDate: context.clock.parseOptionalSalesforceDate(x.Acc_PeriodStartDate__c),
      endDate: context.clock.parseOptionalSalesforceDate(x.Acc_PeriodEndDate__c),
      periodId: x.Acc_ProjectPeriodNumber__c,
      lastUpdated: context.clock.parseOptionalSalesforceDateTime(x.LastModifiedDate)
    }))
    .sort((a, b) => {
      if (b.periodId !== a.periodId) {
        return b.periodId - a.periodId;
      }
      return dateComparator(b.lastUpdated!, a.lastUpdated!);
    });
  }
}
