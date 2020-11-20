import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { MonitoringReportsMessages } from "@content/messages/monitoringReportsMessages";
import { MonitoringReportsLabels } from "@content/labels/monitoringReportsLabels";
import { ProjectDto } from "@framework/dtos";

export class MonitoringReportsCreateContent extends ContentPageBase {
  constructor(private readonly content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "monitoring-reports-create", project);
  }

  public readonly messages = new MonitoringReportsMessages(this, this.project);
  public readonly labels = new MonitoringReportsLabels(this, this.project);

  public readonly backLink = this.getContent("back-link");
}
