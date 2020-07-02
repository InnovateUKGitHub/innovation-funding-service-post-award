import { ContentPageBase } from "../../contentPageBase";
import { Content } from "../../content";
import { ClaimMessages } from "@content/messages/claimMessages";
import { ClaimsLabels } from "@content/labels/claimsLabels";

export class ClaimDetailsContent extends ContentPageBase {
  constructor(private readonly content: Content) {
    super(content, "claim-details");
  }
  public readonly messages = new ClaimMessages(this);
  public readonly labels = new ClaimsLabels(this);
  public readonly backLink = () => this.getContent("back-link");
  public readonly commentsSectionTitle = () => this.getContent("section-title-comments");
  public readonly costsAndGrantSummaryTitle = () => this.getContent("costs-and-grant-summary-title");
}
