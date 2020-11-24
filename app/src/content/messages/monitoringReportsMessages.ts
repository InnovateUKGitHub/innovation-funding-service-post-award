import { ContentBase } from "@content/contentBase";
import { ProjectDto } from "@framework/dtos";

export class MonitoringReportsMessages extends ContentBase {
    constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
      super(parent, "monitoring-reports-messages", project);
    }

    public readonly additionalCommentsGuidance = this.getContent("additionalCommentsGuidance");
    public readonly reportsSubmissionGuidance = this.getContent("reportsSubmissionGuidance");
    public readonly noOpenReportsMessage = this.getContent("noOpenReportsMessage");
    public readonly noArchivedReportsMessage = this.getContent("noArchivedReportsMessage");
    public readonly onDeleteMonitoringReportMessage = this.getContent("onDeleteMonitoringReportMessage");
    public readonly deletingMonitoringReportMessage = this.getContent("deletingMonitoringReportMessage");
    public readonly submittingMonitoringReportMessage = this.getContent("submittingMonitoringReportMessage");
  }
