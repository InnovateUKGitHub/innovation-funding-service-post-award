import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class ValidationSummaryContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "validationSummary", competitionType);
  }

  public readonly validationsTitle = this.getContent("components.validationSummary.title");
}
