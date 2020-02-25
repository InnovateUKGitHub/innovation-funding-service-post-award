import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { MonitoringReportsMessages } from "@content/messages/monitoringReportsMessages";
import { MonitoringReportsLabels } from "@content/labels/monitoringReportsLabels";

export class MonitoringReportsSummaryContent extends ContentPageBase {
  constructor(private content: Content) {
    super(content, "monitoring-reports-summary");
  }

  public readonly messages = new MonitoringReportsMessages(this);
  public readonly labels = new MonitoringReportsLabels(this);

  public readonly editItemButton = () => this.getContent("button-edit-item");
  public readonly submitButton = () => this.getContent("button-submit");
  public readonly saveAndReturnButton = () => this.getContent("button-save-and-return");
}
