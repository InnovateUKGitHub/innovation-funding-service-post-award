import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { MonitoringReportsMessages } from "@content/messages/monitoringReportsMessages";
import { MonitoringReportsLabels } from "@content/labels/monitoringReportsLabels";
import { ContentBase } from "@content/contentBase";

export class MonitoringReportsWorkflowContent extends ContentPageBase {
  constructor(private content: Content) {
    super(content, "monitoring-reports-workflow");
  }

  public readonly messages = new MonitoringReportsMessages(this);
  public readonly labels = new MonitoringReportsLabels(this);

  public readonly editMode = new MonitoringReportsWorkflowContentEditMode(this.content);
  public readonly viewMode = new MonitoringReportsWorkflowContentViewMode(this.content);

  public readonly backLink = () => this.getContent("back-link");

  public readonly backToStepLink = (step: string) => this.getContent("link-back-to-step", {step});
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
