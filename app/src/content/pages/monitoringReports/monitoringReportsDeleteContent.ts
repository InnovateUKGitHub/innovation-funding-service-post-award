import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { MonitoringReportsMessages } from "@content/messages/monitoringReportsMessages";
import { MonitoringReportsLabels } from "@content/labels/monitoringReportsLabels";

export class MonitoringReportsDeleteContent extends ContentPageBase {
  constructor(private readonly content: Content) {
    super(content, "monitoring-reports-delete");
  }

  public readonly messages = new MonitoringReportsMessages(this);
  public readonly labels = new MonitoringReportsLabels(this);

  public readonly backLink = () => this.getContent("back-link");

  public readonly deleteReportButton = () => this.getContent("button-delete-report");
}
