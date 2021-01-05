import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";

export class ClaimForecastContent extends ContentPageBase {
  constructor(private readonly content: Content, protected competitionType?: string) {
    super(content, "claim-forecast", competitionType);
  }
  public readonly messages = new ClaimMessages(this, this.competitionType);
  public readonly backLink = this.getContent("back-link");
  public readonly saveAndReturnButton = this.getContent("button-save-and-return");
  public readonly continueToSummaryButton = this.getContent("button-continue-to-summary");
  public readonly overheadsCosts = this.getContent("overheads-costs");
}
