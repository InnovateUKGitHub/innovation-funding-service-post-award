import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ValidationSummaryContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "validationSummary", competitionType);
  }

  public readonly validationsTitle = this.getContent("components.validationSummary.title");
}
