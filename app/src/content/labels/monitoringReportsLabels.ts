import { ContentBase } from "../contentBase";

export class MonitoringReportsLabels extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "monitoring-reports-labels", competitionType);
  }

  public readonly statusAndCommentsLog = this.getContent("status-and-comments-log");
  public readonly additionalComments = this.getContent("additional-comments");
}
