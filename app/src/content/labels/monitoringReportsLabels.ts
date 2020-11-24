import { ContentBase } from "../contentBase";
import { ProjectDto } from "@framework/dtos";

export class MonitoringReportsLabels extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "monitoring-reports-labels", project);
  }

  public readonly statusAndCommentsLog = this.getContent("status-and-comments-log");
  public readonly additionalComments = this.getContent("additional-comments");
}
