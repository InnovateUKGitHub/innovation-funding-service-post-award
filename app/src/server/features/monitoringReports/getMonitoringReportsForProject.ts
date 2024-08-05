import { ProjectRole } from "@framework/constants/project";
import { MonitoringReportSummaryDto } from "@framework/dtos/monitoringReportDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { dateComparator } from "@framework/util/comparator";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";
import { mapMonitoringReportStatus } from "./mapMonitoringReportStatus";

export class GetMonitoringReportsForProject extends AuthorisedAsyncQueryBase<MonitoringReportSummaryDto[]> {
  public readonly runnableName: string = "GetMonitoringReportsForProject";
  constructor(private readonly projectId: ProjectId) {
    super();
  }

  async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async run(context: IContext): Promise<MonitoringReportSummaryDto[]> {
    const headers = await context.repositories.monitoringReportHeader.getAllForProject(this.projectId);
    return headers
      .map<MonitoringReportSummaryDto>(x => ({
        headerId: x.Id as MonitoringReportId,
        projectId: x.Acc_Project__c as ProjectId,
        status: mapMonitoringReportStatus(x.Acc_MonitoringReportStatus__c),
        statusName: x.MonitoringReportStatusName,
        startDate: context.clock.parseOptionalSalesforceDate(x.Acc_PeriodStartDate__c),
        endDate: context.clock.parseOptionalSalesforceDate(x.Acc_PeriodEndDate__c),
        periodId: x.Acc_ProjectPeriodNumber__c as PeriodId,
        lastUpdated: context.clock.parseOptionalSalesforceDateTime(x.LastModifiedDate),
      }))
      .sort((a, b) => {
        if (b.periodId !== a.periodId) {
          return b.periodId - a.periodId;
        }
        return dateComparator(b.lastUpdated as Date, a.lastUpdated as Date);
      });
  }
}
