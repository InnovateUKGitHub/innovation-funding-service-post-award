import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class ErrorSummaryContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "errorSummary", competitionType);
  }

  public readonly errorTitle = this.getContent("components.errorSummary.title");
  public readonly expiredMessageContent = this.getContent("components.errorSummary.expiredMessage");
  public readonly unsavedWarningContent = this.getContent("components.errorSummary.unsavedWarning");
  public readonly somethingGoneWrongContent = this.getContent("components.errorSummary.somethingGoneWrong");
}
