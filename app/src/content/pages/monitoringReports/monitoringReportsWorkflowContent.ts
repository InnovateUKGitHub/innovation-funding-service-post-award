import { MonitoringReportsMessages } from "@content/messages/monitoringReportsMessages";
import { MonitoringReportsLabels } from "@content/labels/monitoringReportsLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class MonitoringReportsWorkflowContent extends ContentPageBase {
  constructor(private content: Content, competitionType?: string) {
    super(content, "monitoring-reports-workflow", competitionType);
  }

  public readonly messages = new MonitoringReportsMessages(this, this.competitionType);
  public readonly labels = new MonitoringReportsLabels(this, this.competitionType);

  public readonly editMode = new MonitoringReportsWorkflowContentEditMode(this.content);
  public readonly viewMode = new MonitoringReportsWorkflowContentViewMode(this.content);

  public readonly backLink = this.getContent("back-link");

  public readonly backToStepLink = (step: string) => this.getContent("link-back-to-step", { step });
}

export class MonitoringReportsWorkflowContentEditMode extends ContentPageBase {
  constructor(parent: Content) {
    super(parent, "monitoring-reports-workflow-edit");
  }
}

export class MonitoringReportsWorkflowContentViewMode extends ContentPageBase {
  constructor(parent: Content) {
    super(parent, "monitoring-reports-workflow-view");
  }
}
