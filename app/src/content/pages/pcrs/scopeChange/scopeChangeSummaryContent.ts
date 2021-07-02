import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRScopeChangeLabels } from "@content/labels/pcrScopeChangeLabels";

export class PCRScopeChangeSummaryContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-scope-change-summary", competitionType);
  }

  public readonly labels = new PCRScopeChangeLabels(this, this.competitionType);
}
