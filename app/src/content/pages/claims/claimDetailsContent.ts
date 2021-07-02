import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class ClaimDetailsContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "claim-details", competitionType);
  }
  public readonly messages = new ClaimMessages(this, this.competitionType);
  public readonly labels = new ClaimsLabels(this, this.competitionType);
  public readonly backLink = this.getContent("back-link");
  public readonly commentsSectionTitle = this.getContent("section-title-comments");
  public readonly costsAndGrantSummaryTitle = this.getContent("costs-and-grant-summary-title");
}
