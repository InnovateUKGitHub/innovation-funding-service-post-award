import { ContentBase } from "@content/contentBase";

export class MonitoringReportsMessages extends ContentBase {
    constructor(parent: ContentBase) {
      super(parent, "monitoring-reports-messages");
    }

    public readonly reportsSubmissionGuidance = () => this.getContent("reportsSubmissionGuidance");
    public readonly noOpenReportsMessage = () => this.getContent("noOpenReportsMessage");
    public readonly noArchivedReportsMessage = () => this.getContent("noArchivedReportsMessage");
    public readonly onDeleteMonitoringReportMessage = () => this.getContent("onDeleteMonitoringReportMessage");
    public readonly deletingMonitoringReportMessage = () => this.getContent("deletingMonitoringReportMessage");
    public readonly submittingMonitoringReportMessage = () => this.getContent("submittingMonitoringReportMessage");
  }
