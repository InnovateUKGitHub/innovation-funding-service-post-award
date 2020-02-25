import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { MonitoringReportsMessages } from "@content/messages/monitoringReportsMessages";
import { MonitoringReportsLabels } from "@content/labels/monitoringReportsLabels";

export class MonitoringReportsQuestionStepContent extends ContentPageBase {
  constructor(private content: Content) {
    super(content, "monitoring-reports-question-step");
  }

  public readonly messages = new MonitoringReportsMessages(this);
  public readonly labels = new MonitoringReportsLabels(this);

  public readonly continueButton = () => this.getContent("button-continue");
  public readonly saveAndReturnButton = () => this.getContent("button-save-and-return");
}
