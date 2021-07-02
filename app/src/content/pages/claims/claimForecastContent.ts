import { ClaimMessages } from "@content/messages/claimMessages";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ClaimForecastContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "claim-forecast", competitionType);
  }
  public readonly messages = new ClaimMessages(this, this.competitionType);
  public readonly backLink = this.getContent("back-link");
  public readonly saveAndReturnButton = this.getContent("button-save-and-return");
  public readonly continueToSummaryButton = this.getContent("button-continue-to-summary");
  public readonly overheadsCosts = this.getContent("overheads-costs");
}
