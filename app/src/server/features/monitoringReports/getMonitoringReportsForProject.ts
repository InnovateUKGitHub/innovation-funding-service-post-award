import { QueryBase, SALESFORCE_DATE_FORMAT } from "../common";
import { Authorisation, IContext, ProjectRole } from "../../../types";
import { MonitoringReportSummaryDto } from "../../../types/dtos/monitoringReportDto";
import { MonitoringReportStatus } from "../../../types/constants/monitoringReportStatus";

export class GetMonitoringReportsForProject extends QueryBase<MonitoringReportSummaryDto[]> {
  constructor(
    private readonly projectId: string,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.monitoringReports && auth.for(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext): Promise<MonitoringReportSummaryDto[]> {
    const headers = await context.repositories.monitoringReportHeader.getAllForProject(this.projectId);
    return headers.map<MonitoringReportSummaryDto>(x => ({
      headerId: x.Id,
      status: x.Acc_MonitoringReportStatus__c === "Draft" ? MonitoringReportStatus.DRAFT : MonitoringReportStatus.SUBMITTED,
      startDate: context.clock.parse(x.Acc_ProjectStartDate__c, SALESFORCE_DATE_FORMAT)!,
      endDate: context.clock.parse(x.Acc_ProjectEndDate__c, SALESFORCE_DATE_FORMAT)!,
      periodId: x.Acc_ProjectPeriodNumber__c,
      lastUpdated: null
    }))
    .sort((a, b) => b.periodId - a.periodId);
  }
}
