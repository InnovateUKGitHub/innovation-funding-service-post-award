import { ContentPageBase } from "../../../contentPageBase";
import { Content } from "../../../content";
import { PCRScopeChangeLabels } from "@content/labels/pcrScopeChangeLabels";

export class PCRScopeChangeSummaryContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "pcr-scope-change-summary", competitionType);
  }

  public readonly labels = new PCRScopeChangeLabels(this, this.competitionType);
}
