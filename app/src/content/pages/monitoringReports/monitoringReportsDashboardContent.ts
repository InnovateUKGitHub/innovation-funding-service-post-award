import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { MonitoringReportsMessages } from "@content/messages/monitoringReportsMessages";
import { MonitoringReportsLabels } from "@content/labels/monitoringReportsLabels";

export class MonitoringReportsDashboardContent extends ContentPageBase {
  constructor(private readonly content: Content) {
    super(content, "monitoring-reports-dashboard");
  }

  public readonly messages = new MonitoringReportsMessages(this);
  public readonly labels = new MonitoringReportsLabels(this);

  public readonly buttonNewMonitoringReport = () => this.getContent("button-new-monitoring-report");

  public readonly sectionTitleOpen = () => this.getContent("section-title-open");
  public readonly sectionTitleArchived = () => this.getContent("section-title-archived");

  public readonly linkViewMonitoringReport = () => this.getContent("link-view-monitoring-report");
  public readonly linkEditMonitoringReport = () => this.getContent("link-edit-monitoring-report");
  public readonly linkDeleteMonitoringReport = () => this.getContent("link-delete-monitoring-report");
}
