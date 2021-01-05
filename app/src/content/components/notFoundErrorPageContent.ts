import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class NotFoundErrorPageContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "notFoundError", competitionType);
  }

  public readonly notFoundError = this.getContent("components.notFoundErrorPage.errorMessage");
  public readonly goBackMessage = this.getContent("components.notFoundErrorPage.goBackMessage");
  public readonly yourDashboardMessage = this.getContent("components.notFoundErrorPage.yourDashBoard");
  public readonly innovateUKMessage = this.getContent("components.notFoundErrorPage.innovateUKMessage");
}
