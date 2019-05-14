import { ISalesforceMonitoringReportHeader } from "@server/repositories";
import { MonitoringReportStatus } from "@framework/constants";
import { MonitoringReportStatusChangeDto } from "@framework/types";

export function mapMonitoringReportStatus(report: ISalesforceMonitoringReportHeader | MonitoringReportStatusChangeDto) {
  const status = isMonitoringReportHeader(report) ? report.Acc_MonitoringReportStatus__c : report.newStatus;
  switch (status) {
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

const isMonitoringReportHeader = (report: ISalesforceMonitoringReportHeader | MonitoringReportStatusChangeDto): report is ISalesforceMonitoringReportHeader => {
  return (report as ISalesforceMonitoringReportHeader).Acc_MonitoringReportStatus__c !== undefined;
};
