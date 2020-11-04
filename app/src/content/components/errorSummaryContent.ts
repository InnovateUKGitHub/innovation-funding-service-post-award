import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class ErrorSummaryContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "errorSummary", project);
  }

  public readonly errorTitle = this.getContent("components.errorSummary.title");
  public readonly expiredMessageContent = this.getContent("components.errorSummary.expiredMessage");
  public readonly unsavedWarningContent = this.getContent("components.errorSummary.unsavedWarning");
  public readonly somethingGoneWrongContent = this.getContent("components.errorSummary.somethingGoneWrong");
}
