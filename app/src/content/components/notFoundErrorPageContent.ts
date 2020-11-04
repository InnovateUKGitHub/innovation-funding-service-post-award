import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class NotFoundErrorPageContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "notFoundError", project);
  }

  public readonly notFoundError = this.getContent("components.notFoundErrorPage.errorMessage");
  public readonly goBackMessage = this.getContent("components.notFoundErrorPage.goBackMessage");
  public readonly yourDashboardMessage = this.getContent("components.notFoundErrorPage.yourDashBoard");
  public readonly innovateUKMessage = this.getContent("components.notFoundErrorPage.innovateUKMessage");

}
