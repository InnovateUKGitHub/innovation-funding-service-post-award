import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class LogsContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "logs", competitionType);
  }

  public readonly noChangesMessage = this.getContent("components.logs.noChangesMessage");
  public readonly columnHeaderDate = this.getContent("components.logs.columnHeaderDate");
  public readonly statusUpdate = this.getContent("components.logs.statusUpdate");
  public readonly createdBy = this.getContent("components.logs.createdBy");
}
