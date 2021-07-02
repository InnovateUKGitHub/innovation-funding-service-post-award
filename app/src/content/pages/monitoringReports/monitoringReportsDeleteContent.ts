import { MonitoringReportsMessages } from "@content/messages/monitoringReportsMessages";
import { MonitoringReportsLabels } from "@content/labels/monitoringReportsLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class MonitoringReportsDeleteContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "monitoring-reports-delete", competitionType);
  }

  public readonly messages = new MonitoringReportsMessages(this, this.competitionType);
  public readonly labels = new MonitoringReportsLabels(this, this.competitionType);

  public readonly backLink = this.getContent("back-link");

  public readonly deleteReportButton = this.getContent("button-delete-report");
}
