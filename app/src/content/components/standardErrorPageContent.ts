import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class StandardErrorPageContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "standardError", competitionType);
  }

  public readonly standardError = this.getContent("components.standardErrorPage.message");
  public readonly dashboardText = this.getContent("components.standardErrorPage.dashboardText");
}
