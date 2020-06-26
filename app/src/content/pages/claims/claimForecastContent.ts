import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";

export class ClaimForecastContent extends ContentPageBase {
  constructor(private content: Content) {
    super(content, "claim-forecast");
  }
  public readonly messages = new ClaimMessages(this);
  public readonly backLink = () => this.getContent("back-link");
  public readonly saveAndReturnButton = () => this.getContent("button-save-and-return");
  public readonly continueToSummaryButton = () => this.getContent("button-continue-to-summary");
  public readonly overheadsCosts = () => this.getContent("overheads-costs");
}
