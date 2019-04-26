import { QueryBase } from "../common";
import { Authorisation, IContext, ProjectRole } from "../../../types";
import { MonitoringReportSummaryDto } from "../../../types/dtos/monitoringReportDto";
import { mapMonitoringReportStatus } from "./mapMonitoringReportStatus";

export class GetMonitoringReportsForProject extends QueryBase<MonitoringReportSummaryDto[]> {
  constructor(
    private readonly projectId: string,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.monitoringReports && auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext): Promise<MonitoringReportSummaryDto[]> {
    const headers = await context.repositories.monitoringReportHeader.getAllForProject(this.projectId);
    return headers.map<MonitoringReportSummaryDto>(x => ({
      headerId: x.Id,
      projectId: x.Acc_Project__c,
      title: x.Name,
      status: mapMonitoringReportStatus(x),
      statusName: x.MonitoringReportStatusName,
      startDate: context.clock.parseRequiredSalesforceDate(x.Acc_PeriodStartDate__c),
      endDate: context.clock.parseRequiredSalesforceDate(x.Acc_PeriodEndDate__c),
      periodId: x.Acc_ProjectPeriodNumber__c,
      lastUpdated: context.clock.parseRequiredSalesforceDateTime(x.LastModifiedDate)
    }))
    .sort((a, b) => b.periodId - a.periodId);
  }
}
