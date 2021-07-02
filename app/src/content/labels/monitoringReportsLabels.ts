import { ContentBase } from "@content/contentBase";

export class MonitoringReportsLabels extends ContentBase {
  constructor(parent: ContentBase, competitionType?: string) {
    super(parent, "monitoring-reports-labels", competitionType);
  }

  public readonly statusAndCommentsLog = this.getContent("status-and-comments-log");
  public readonly additionalComments = this.getContent("additional-comments");
}
