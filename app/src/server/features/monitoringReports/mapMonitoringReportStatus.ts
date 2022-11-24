import { MonitoringReportStatus } from "@framework/constants";

/**
 * converts monitoring report string to corresponding enum value,
 * defaults to `Unknown`
 */
export function mapMonitoringReportStatus(status: string) {
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
