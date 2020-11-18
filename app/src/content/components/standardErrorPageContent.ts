import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class StandardErrorPageContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "standardError", project);
  }

  public readonly standardError = this.getContent("components.standardErrorPage.message");
  public readonly dashboardText = this.getContent("components.standardErrorPage.dashboardText");
}
