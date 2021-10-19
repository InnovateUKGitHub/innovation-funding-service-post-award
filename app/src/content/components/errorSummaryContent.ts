import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ErrorSummaryContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "errorSummary", competitionType);
  }

  public readonly errorTitle = this.getContent("components.errorSummary.title");
  public readonly expiredMessageContent = this.getContent("components.errorSummary.expiredMessage");
  public readonly unsavedWarningContent = this.getContent("components.errorSummary.unsavedWarning");
  public readonly somethingGoneWrongContent = this.getContent("components.errorSummary.somethingGoneWrong");

  // Unique Errors
  public readonly updateAllFailure = this.getContent("components.errorSummary.updateAllFailure");
  public readonly insufficienceAccessRights = this.getContent("components.errorSummary.insufficienceAccessRights");
  public readonly notUploadedByOwner = this.getContent("components.errorSummary.notUploadedByOwner");
}
