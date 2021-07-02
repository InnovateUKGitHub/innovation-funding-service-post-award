import { MonitoringReportsMessages } from "@content/messages/monitoringReportsMessages";
import { MonitoringReportsLabels } from "@content/labels/monitoringReportsLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class MonitoringReportsDashboardContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "monitoring-reports-dashboard", competitionType);
  }

  public readonly messages = new MonitoringReportsMessages(this, this.competitionType);
  public readonly labels = new MonitoringReportsLabels(this, this.competitionType);

  public readonly buttonNewMonitoringReport = this.getContent("button-new-monitoring-report");

  public readonly sectionTitleOpen = this.getContent("section-title-open");
  public readonly sectionTitleArchived = this.getContent("section-title-archived");

  public readonly linkViewMonitoringReport = this.getContent("link-view-monitoring-report");
  public readonly linkEditMonitoringReport = this.getContent("link-edit-monitoring-report");
  public readonly linkDeleteMonitoringReport = this.getContent("link-delete-monitoring-report");
  public readonly titleHeader = this.getContent("header-title");
  public readonly statusHeader = this.getContent("header-status");
  public readonly dateUploadedHeader = this.getContent("header-date-updated");
  public readonly actionHeader = this.getContent("header-action");
}
