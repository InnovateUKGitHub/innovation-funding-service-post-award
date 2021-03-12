import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";

export class NotFoundErrorContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "not-found-error");
  }

  public readonly notFoundError = this.getContent("errorMessage");
  public readonly goBackMessage = this.getContent("goBackMessage");
  public readonly yourDashboardMessage = this.getContent("yourDashBoard");
  public readonly innovateUKMessage = this.getContent("innovateUKMessage");
}
