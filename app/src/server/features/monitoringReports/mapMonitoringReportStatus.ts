// import { MonitoringReportStatus } from "../../../types/constants/monitoringReportStatus";
import { ISalesforceMonitoringReportHeader } from "@server/repositories";
import { MonitoringReportStatus } from "@framework/types/constants/monitoringReportStatus";

export function mapMonitoringReportStatus(report: ISalesforceMonitoringReportHeader) {
  switch (report.Acc_MonitoringReportStatus__c) {
    case "Draft":
      return MonitoringReportStatus.Draft;
    case "Approved":
      return MonitoringReportStatus.Approved;
    case "Awaiting IUK Approval":
      return MonitoringReportStatus.AwaitingApproval;
    case "IUK Queried":
      return MonitoringReportStatus.Queried;
    case "New":
      return MonitoringReportStatus.New;
    default:
      return MonitoringReportStatus.Unknown;
  }
}
