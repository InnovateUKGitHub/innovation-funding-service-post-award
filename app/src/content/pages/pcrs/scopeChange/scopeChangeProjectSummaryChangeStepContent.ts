import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { PCRItem } from "../pcrItem";

export class PCRScopeChangeProjectSummaryChangeContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "pcr-scope-change-project-summary-change", competitionType);
  }

  public readonly pcrItem = new PCRItem(this, this.competitionType);

  public readonly projectSummaryHeading = this.getContent("heading-project-summary");
  public readonly publishedSummary = this.getContent("published-summary");
  public readonly noAvailableSummary = this.getContent("no-available-summary");
}
