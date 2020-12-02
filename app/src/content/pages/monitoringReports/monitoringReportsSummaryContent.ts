import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { MonitoringReportsMessages } from "@content/messages/monitoringReportsMessages";
import { MonitoringReportsLabels } from "@content/labels/monitoringReportsLabels";
import { ProjectDto } from "@framework/dtos";

export class MonitoringReportsSummaryContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "monitoring-reports-summary", project);
  }

  public readonly messages = new MonitoringReportsMessages(this, this.project);
  public readonly labels = new MonitoringReportsLabels(this, this.project);

  public readonly editItemButton = this.getContent("button-edit-item");
  public readonly submitButton = this.getContent("button-submit");
  public readonly saveAndReturnButton = this.getContent("button-save-and-return");
  public readonly scoreLabel = this.getContent("score-label");
  public readonly commentLabel = this.getContent("comment-label");
  public readonly periodLabel = this.getContent("period-label");
}
