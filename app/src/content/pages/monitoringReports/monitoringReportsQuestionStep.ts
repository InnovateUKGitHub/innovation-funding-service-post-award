import { MonitoringReportsMessages } from "@content/messages/monitoringReportsMessages";
import { MonitoringReportsLabels } from "@content/labels/monitoringReportsLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class MonitoringReportsQuestionStepContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "monitoring-reports-question-step", competitionType);
  }

  public readonly messages = new MonitoringReportsMessages(this, this.competitionType);
  public readonly labels = new MonitoringReportsLabels(this, this.competitionType);

  public readonly continueButton = this.getContent("button-continue");
  public readonly saveAndReturnButton = this.getContent("button-save-and-return");
  public readonly commentLabel = this.getContent("comment-label");
}
