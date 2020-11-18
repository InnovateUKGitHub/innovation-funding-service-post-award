import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class LogsContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "logs", project);
  }

  public readonly noChangesMessage = this.getContent("components.logs.noChangesMessage");
  public readonly columnHeaderDate = this.getContent("components.logs.columnHeaderDate");
  public readonly statusUpdate = this.getContent("components.logs.statusUpdate");
  public readonly createdBy = this.getContent("components.logs.createdBy");
}
