import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { MonitoringReportsMessages } from "@content/messages/monitoringReportsMessages";
import { MonitoringReportsLabels } from "@content/labels/monitoringReportsLabels";
import { ProjectDto } from "@framework/dtos";

export class MonitoringReportsDashboardContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "monitoring-reports-dashboard", project);
  }

  public readonly messages = new MonitoringReportsMessages(this, this.project);
  public readonly labels = new MonitoringReportsLabels(this, this.project);

  public readonly buttonNewMonitoringReport = this.getContent("button-new-monitoring-report");

  public readonly sectionTitleOpen = this.getContent("section-title-open");
  public readonly sectionTitleArchived = this.getContent("section-title-archived");

  public readonly linkViewMonitoringReport = this.getContent("link-view-monitoring-report");
  public readonly linkEditMonitoringReport = this.getContent("link-edit-monitoring-report");
  public readonly linkDeleteMonitoringReport = this.getContent("link-delete-monitoring-report");
  public readonly titleHeader  = this.getContent("header-title");
  public readonly statusHeader = this.getContent("header-status");
  public readonly dateUploadedHeader = this.getContent("header-date-updated");
  public readonly actionHeader = this.getContent("header-action");
}
