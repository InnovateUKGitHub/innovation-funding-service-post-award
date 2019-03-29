import { QueryBase, SALESFORCE_DATE_FORMAT } from "../common";
import { Authorisation, IContext, ProjectRole } from "../../../types";

export class GetMonitoringReportsForProject extends QueryBase<MonitoringReportSummaryDto[]> {
  constructor(
    private readonly projectId: string,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.for(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext): Promise<MonitoringReportSummaryDto[]> {
    const headers = await context.repositories.monitoringReportHeader.getAllForProject(this.projectId);
    return headers.map(x => ({
      headerId: x.Id,
      status: x.Acc_MonitoringReportStatus__c,
      startDate: context.clock.parse(x.Acc_ProjectStartDate__c, SALESFORCE_DATE_FORMAT)!,
      endDate: context.clock.parse(x.Acc_ProjectEndDate__c, SALESFORCE_DATE_FORMAT)!,
      periodId: x.Acc_ProjectPeriodNumber__c,
    }))
    .sort((a, b) => a.periodId - b.periodId);
  }
}
