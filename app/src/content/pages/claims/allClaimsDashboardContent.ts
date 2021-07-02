import { ClaimsLabels } from "@content/labels/claimsLabels";
import { ClaimMessages } from "@content/messages/claimMessages";
import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";

export class AllClaimsDashboardContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "all-claims-dashboard", competitionType);
  }
  public readonly messages = new ClaimMessages(this, this.competitionType);
  public readonly labels = new ClaimsLabels(this, this.competitionType);
  public readonly sbriGuidanceMessage = this.getContent("sbri-guidance-message");
}
