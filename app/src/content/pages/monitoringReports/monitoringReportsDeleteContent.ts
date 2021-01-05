import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { MonitoringReportsMessages } from "@content/messages/monitoringReportsMessages";
import { MonitoringReportsLabels } from "@content/labels/monitoringReportsLabels";

export class MonitoringReportsDeleteContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
    super(content, "monitoring-reports-delete", competitionType);
  }

  public readonly messages = new MonitoringReportsMessages(this, this.competitionType);
  public readonly labels = new MonitoringReportsLabels(this, this.competitionType);

  public readonly backLink = this.getContent("back-link");

  public readonly deleteReportButton = this.getContent("button-delete-report");
}
